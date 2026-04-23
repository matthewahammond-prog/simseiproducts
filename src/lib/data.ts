import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  specs: Record<string, string>;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  company: string;
}

// Fetch all products (admin) or visible products (stakeholder - handled by RLS)
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name");
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    description: p.description || "",
    category: p.category,
    image: p.image || "",
    specs: (p.specs as Record<string, string>) || {},
  }));
}

// Fetch only products visible to a specific user (explicit join for stakeholders)
export async function getVisibleProducts(userId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("product_visibility")
    .select("products(*)")
    .eq("user_id", userId);
  if (error) {
    console.error("Error fetching visible products:", error);
    return [];
  }
  const products = (data || [])
    .map((row: any) => row.products)
    .filter(Boolean)
    .map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description || "",
      category: p.category,
      image: p.image || "",
      specs: (p.specs as Record<string, string>) || {},
    }));
  products.sort((a, b) => a.name.localeCompare(b.name));
  return products;
}

// Team member management (calls edge function for auth user create/delete)
export async function createTeamMember(payload: { name: string; email: string; company: string; password?: string }) {
  const { data, error } = await supabase.functions.invoke("manage-team-member", {
    body: { action: "create", ...payload },
  });
  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  return { data };
}

export async function deleteTeamMember(userId: string) {
  const { data, error } = await supabase.functions.invoke("manage-team-member", {
    body: { action: "delete", userId },
  });
  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  return { data };
}

export async function updateTeamMember(userId: string, updates: { name?: string; company?: string }) {
  const { error } = await supabase.from("profiles").update(updates).eq("id", userId);
  if (error) return { error: error.message };
  return { data: true };
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name,
    description: data.description || "",
    category: data.category,
    image: data.image || "",
    specs: (data.specs as Record<string, string>) || {},
  };
}

export async function saveProduct(product: Omit<Product, "id"> & { id?: string }): Promise<Product | null> {
  if (product.id) {
    const { data, error } = await supabase
      .from("products")
      .update({
        name: product.name,
        description: product.description,
        category: product.category,
        image: product.image,
        specs: product.specs,
      })
      .eq("id", product.id)
      .select()
      .maybeSingle();
    if (error) { console.error("Error updating product:", error); return null; }
    return data ? { ...data, specs: (data.specs as Record<string, string>) || {} } : null;
  } else {
    const { data, error } = await supabase
      .from("products")
      .insert({
        name: product.name,
        description: product.description,
        category: product.category,
        image: product.image,
        specs: product.specs,
      })
      .select()
      .maybeSingle();
    if (error) { console.error("Error inserting product:", error); return null; }
    return data ? { ...data, specs: (data.specs as Record<string, string>) || {} } : null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) { console.error("Error deleting product:", error); return false; }
  return true;
}

// Profiles
export async function getProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.from("profiles").select("*").order("name");
  if (error) { console.error("Error fetching profiles:", error); return []; }
  return data || [];
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return data;
}

// Product visibility
export async function getProductVisibility(productId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("product_visibility")
    .select("user_id")
    .eq("product_id", productId);
  if (error) { console.error("Error fetching visibility:", error); return []; }
  return (data || []).map((row: any) => row.user_id);
}

export async function getAllProductVisibility(): Promise<Record<string, string[]>> {
  const { data, error } = await supabase
    .from("product_visibility")
    .select("product_id, user_id");
  if (error) { console.error("Error fetching all visibility:", error); return {}; }
  const map: Record<string, string[]> = {};
  (data || []).forEach((row: any) => {
    if (!map[row.product_id]) map[row.product_id] = [];
    map[row.product_id].push(row.user_id);
  });
  return map;
}

export async function setProductVisibility(productId: string, userIds: string[]): Promise<boolean> {
  // Delete existing visibility for this product
  const { error: delError } = await supabase
    .from("product_visibility")
    .delete()
    .eq("product_id", productId);
  if (delError) { console.error("Error clearing visibility:", delError); return false; }

  if (userIds.length === 0) return true;

  const rows = userIds.map((uid) => ({ product_id: productId, user_id: uid }));
  const { error } = await supabase.from("product_visibility").insert(rows);
  if (error) { console.error("Error setting visibility:", error); return false; }
  return true;
}

export async function toggleProductVisibility(productId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("product_visibility")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", userId)
    .maybeSingle();

  if (data) {
    const { error } = await supabase.from("product_visibility").delete().eq("id", data.id);
    if (error) { console.error("Error removing visibility:", error); return false; }
  } else {
    const { error } = await supabase.from("product_visibility").insert({ product_id: productId, user_id: userId });
    if (error) { console.error("Error adding visibility:", error); return false; }
  }
  return true;
}

// Check user role
export async function getUserRole(userId: string): Promise<"admin" | "stakeholder" | null> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return data.role as "admin" | "stakeholder";
}
