import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Check if products already exist
    const { count } = await supabase.from("products").select("*", { count: "exact", head: true });
    if (count && count > 0) {
      return new Response(JSON.stringify({ message: "Data already seeded" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create stakeholder users
    const stakeholders = [
      { email: "sarah@acmecorp.com", password: "acme2024", name: "Sarah Chen", company: "Acme Corp" },
      { email: "james@globex.com", password: "globex2024", name: "James Rivera", company: "Globex Inc" },
      { email: "maria@initech.com", password: "initech2024", name: "Maria Petrov", company: "Initech Ltd" },
    ];

    const userIds: string[] = [];
    for (const s of stakeholders) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: s.email,
        password: s.password,
        email_confirm: true,
        user_metadata: { name: s.name, company: s.company },
      });
      if (error) {
        console.error("Error creating user:", s.email, error);
        // Try to get existing user
        const { data: users } = await supabase.auth.admin.listUsers();
        const existing = users?.users?.find((u: any) => u.email === s.email);
        if (existing) userIds.push(existing.id);
        continue;
      }
      userIds.push(data.user.id);
    }

    // Create admin user
    const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
      email: "admin@simsei.com",
      password: "admin123",
      email_confirm: true,
      user_metadata: { name: "Admin", company: "SIMSEI", role: "admin" },
    });
    if (adminError) console.error("Admin create error:", adminError);

    // Insert products
    const products = [
      { name: "LTS01, SIMSEI PEGBOARD EXERCISE", description: "SIMSEI Pegboard Exercise", category: "Skills Exercises", image: "", specs: { "Item Number": "777000901" } },
      { name: "LTS02, SIMSEI TISSUE PLATFORM 1/EA", description: "SIMSEI Tissue Platform", category: "Skills Exercises", image: "", specs: { "Item Number": "777024001" } },
      { name: "LTS03, SIMSEI TISSUE MODEL 10/PK", description: "SIMSEI Tissue Model, 10 pack", category: "Skills Exercises", image: "", specs: { "Item Number": "777023901" } },
      { name: "LTS04, SIMSEI DISSECTION MODEL 5/PK", description: "SIMSEI Dissection Model, 5 pack", category: "Skills Exercises", image: "", specs: { "Item Number": "777052172" } },
      { name: "LTS05, SIMSEI SUTURE PASSING EXERCISE", description: "SIMSEI Suture Passing Exercise", category: "Skills Exercises", image: "", specs: { "Item Number": "777052753" } },
      { name: "LTS06, SIMSEI 0° CAMERA NAVIGATION EXERCISE", description: "SIMSEI 0° Camera Navigation Exercise", category: "Skills Exercises", image: "", specs: { "Item Number": "777052644" } },
      { name: "LTS07, SIMSEI TISSUE MODEL 1/EA", description: "SIMSEI Tissue Model, single", category: "Skills Exercises", image: "", specs: { "Item Number": "777053060" } },
      { name: "LTS08, SIMSEI DISSECTION MODEL 1/EA", description: "SIMSEI Dissection Model, single", category: "Skills Exercises", image: "", specs: { "Item Number": "777053062" } },
      { name: "LTS09, SIMSEI MULTISKILL EXERCISE 1/EA", description: "SIMSEI Multiskill Exercise", category: "Skills Exercises", image: "", specs: { "Item Number": "777053424" } },
      { name: "LTT01, SIMSEI GALLBLADDER BASE", description: "SIMSEI Gallbladder Base", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777020101" } },
      { name: "LTT02, SIMSEI GALLBLADDER MODEL 1/EA", description: "SIMSEI Gallbladder Model, single", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777014201" } },
      { name: "LTT03, SIMSEI GALLBLADDER MODEL 5/PK", description: "SIMSEI Gallbladder Model, 5 pack", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777014301" } },
      { name: "LTT04, SIMSEI VAGINAL CUFF MODEL 1/EA", description: "SIMSEI Vaginal Cuff Model, single", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777053071" } },
      { name: "LTT05, SIMSEI GYN MODEL 1/EA", description: "SIMSEI GYN Model, single", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777031301" } },
      { name: "LTT11, SIMSEI FIRST ENTRY MODEL 1/EA", description: "SIMSEI First Entry Model, single", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777053042" } },
      { name: "LTT17, SIMSEI GYN MODEL 1/EA", description: "SIMSEI GYN Model, single", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777052561" } },
      { name: "LTT06, SIMSEI TRANSANAL ADAPTER", description: "SIMSEI Transanal Adapter", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777004801" } },
      { name: "LTT07, SIMSEI RECTUM MODEL 3/PK", description: "SIMSEI Rectum Model, 3 pack", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777004901" } },
      { name: "LTT27, SIMSEI SUTURABLE RECTUM MODEL 5/PK", description: "SIMSEI Suturable Rectum Model, 5 pack", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777052015" } },
      { name: "LTT08, SIMSEI VAGINAL CUFF BASE", description: "SIMSEI Vaginal Cuff Base", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777051801" } },
      { name: "LTT09, SIMSEI VAGINAL CUFF MODEL 10/PK", description: "SIMSEI Vaginal Cuff Model, 10 pack", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777030901" } },
      { name: "LTT10, SIMSEI FIRST ENTRY MODEL 4/PK", description: "SIMSEI First Entry Model, 4 pack", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777026601" } },
      { name: "LTT12, SIMSEI ANASTOMOSIS MODEL 10/PK", description: "SIMSEI Anastomosis Model, 10 pack", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777029801" } },
      { name: "LTT13, SIMSEI ANASTOMOSIS MODEL 2/EA", description: "SIMSEI Anastomosis Model, 2 pack", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777053063" } },
      { name: "LTT14, SIMSEI APPENDECTOMY MODEL", description: "SIMSEI Appendectomy Model", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777046101" } },
      { name: "LTT18, SIMSEI EXTRACTION INSERT 1/EA", description: "SIMSEI Extraction Insert, single", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777052188" } },
      { name: "LTT19, SIMSEI SIMULATED UTERUS MODEL", description: "SIMSEI Simulated Uterus Model", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777052346" } },
      { name: "LTT20, SIMSEI RENAL HILUM MODEL", description: "SIMSEI Renal Hilum Model", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777052736" } },
      { name: "LTT28, SIMSEI ECTOPIC PREGNANCY MODEL", description: "SIMSEI Ectopic Pregnancy Model", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777053403" } },
      { name: "LTT29, SIMSEI OVARIAN CYST TORSION MODEL", description: "SIMSEI Ovarian Cyst Torsion Model", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777053404" } },
      { name: "LTT31, SIMSEI COLPOTOMY MODEL", description: "SIMSEI Colpotomy Model", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777053595" } },
      { name: "LTT26, SIMSEI TRANSANAL ADAPTER SLEEVE 5/PK", description: "SIMSEI Transanal Adapter Sleeve, 5 pack", category: "Task Trainers & Models", image: "", specs: { "Item Number": "777052093" } },
      { name: "LTC11, SIMSEI LARGE AB WALL INSERT 4/PK", description: "SIMSEI Large Ab Wall Insert, 4 pack", category: "Consumables", image: "", specs: { "Item Number": "777007601" } },
      { name: "LTC14, SIMSEI SMALL AB WALL INSERT 15/PK", description: "SIMSEI Small Ab Wall Insert, 15 pack", category: "Consumables", image: "", specs: { "Item Number": "777008301" } },
      { name: "LTC09, SIMSEI LARGE AB WALL INSERT 4/PK (BASIC)", description: "SIMSEI Large Ab Wall Insert (Basic), 4 pack", category: "Consumables", image: "", specs: { "Item Number": "777049401" } },
      { name: "LTC10, SIMSEI SMALL AB WALL INSERT 4/PK (BASIC)", description: "SIMSEI Small Ab Wall Insert (Basic), 4 pack", category: "Consumables", image: "", specs: { "Item Number": "777049301" } },
      { name: "LTC16, SIMSEI GelPOINT PLATFORM PK", description: "SIMSEI GelPOINT Platform Pack", category: "Consumables", image: "", specs: { "Item Number": "777020001" } },
      { name: "LTC23, SIMSEI GELPOINT PATH PLATFORM PK", description: "SIMSEI GelPOINT Path Platform Pack", category: "Consumables", image: "", specs: { "Item Number": "777006201" } },
      { name: "LTC01, SIMSEI PRO LAYERED INSERT", description: "SIMSEI Pro Layered Insert", category: "Consumables", image: "", specs: { "Item Number": "777052582" } },
      { name: "LTC01R, SIMSEI PRO LAYERED INSERT", description: "SIMSEI Pro Layered Insert (Replacement)", category: "Consumables", image: "", specs: { "Item Number": "777052583" } },
      { name: "LT001, SIMSEI LAPAROSCOPIC TRAINER (Gen 1 Camera)", description: "SIMSEI Laparoscopic Trainer with Gen 1 Camera", category: "Trainers", image: "", specs: { "Item Number": "777052331" } },
      { name: "LT001, SIMSEI LAPAROSCOPIC TRAINER (Gen 2 Camera)", description: "SIMSEI Laparoscopic Trainer with Gen 2 Camera", category: "Trainers", image: "", specs: { "Item Number": "777053001" } },
      { name: "LT001, SIMSEI LAPAROSCOPIC TRAINER (Gen 3 Camera)", description: "SIMSEI Laparoscopic Trainer with Gen 3 Camera", category: "Trainers", image: "", specs: { "Item Number": "777053718" } },
      { name: "LT002, SIMSEI LAPAROSCOPIC TRAINER EF", description: "SIMSEI Laparoscopic Trainer EF", category: "Trainers", image: "", specs: { "Item Number": "777052175" } },
      { name: "LTA11, SIMSEI 10mm 0° CAMERA (Gen 1)", description: "SIMSEI 10mm 0° Camera, Gen 1", category: "Accessories", image: "", specs: { "Item Number": "777052321" } },
      { name: "LTA11, SIMSEI 10mm 0° CAMERA (Gen 2)", description: "SIMSEI 10mm 0° Camera, Gen 2", category: "Accessories", image: "", specs: { "Item Number": "777052941" } },
      { name: "LTA11, SIMSEI 10mm 0° CAMERA (Gen 3)", description: "SIMSEI 10mm 0° Camera, Gen 3", category: "Accessories", image: "", specs: { "Item Number": "777053717" } },
      { name: "LTA12, SIMSEI CAMERA HOLDER", description: "SIMSEI Camera Holder", category: "Accessories", image: "", specs: { "Item Number": "777052326" } },
      { name: "LTA13, SCOPE HOLDER THUMB SCREW", description: "Scope Holder Thumb Screw", category: "Accessories", image: "", specs: { "Item Number": "777053323" } },
      { name: "LTA15, SIMSEI 10mm 30° CAMERA (Gen 1)", description: "SIMSEI 10mm 30° Camera, Gen 1", category: "Accessories", image: "", specs: { "Item Number": "777053450" } },
      { name: "LTA22, SIMSEI LAPAROSCOPIC INSERT", description: "SIMSEI Laparoscopic Insert", category: "Accessories", image: "", specs: { "Item Number": "777052749" } },
      { name: "LTA20, SIMSEI DEMO INSERT", description: "SIMSEI Demo Insert", category: "Accessories", image: "", specs: { "Item Number": "777008601" } },
      { name: "LTA23, SIMSEI SMALL AB WALL HOLDER", description: "SIMSEI Small Ab Wall Holder", category: "Accessories", image: "", specs: { "Item Number": "777008501" } },
      { name: "LTA21, SIMSEI ADJUSTABLE LEGS", description: "SIMSEI Adjustable Legs", category: "Accessories", image: "", specs: { "Item Number": "777008701" } },
      { name: "LTA30, SIMSEI CAMERA CASE", description: "SIMSEI Camera Case", category: "Accessories", image: "", specs: { "Item Number": "777052448" } },
      { name: "LTA31, SIMSEI CARRYING CASE", description: "SIMSEI Carrying Case", category: "Accessories", image: "", specs: { "Item Number": "777013401" } },
      { name: "LTA25, SIMSEI 12MM FIOS DEMO TROCAR", description: "SIMSEI 12mm FIOS Demo Trocar", category: "Accessories", image: "", specs: { "Item Number": "777052312" } },
      { name: "LTP10, SIMSEI POWER SUPPLY", description: "SIMSEI Power Supply", category: "Power Supplies", image: "", specs: { "Item Number": "777028101" } },
      { name: "LTP11, SIMSEI POWER ADAPTER USA & JP", description: "SIMSEI Power Adapter for USA & Japan", category: "Power Supplies", image: "", specs: { "Item Number": "777052322" } },
      { name: "LTP12, SIMSEI POWER ADAPTER UK", description: "SIMSEI Power Adapter for UK", category: "Power Supplies", image: "", specs: { "Item Number": "777052323" } },
      { name: "LTP13, SIMSEI POWER ADAPTER EU & SA", description: "SIMSEI Power Adapter for EU & South America", category: "Power Supplies", image: "", specs: { "Item Number": "777052325" } },
      { name: "LTP14, SIMSEI POWER ADAPTER AU", description: "SIMSEI Power Adapter for Australia", category: "Power Supplies", image: "", specs: { "Item Number": "777052324" } },
      { name: "LCE01, CLIN ED GENERAL SURGERY TRAY", description: "Clinical Education General Surgery Tray", category: "Clinical Education", image: "", specs: { "Item Number": "777034201" } },
      { name: "LCE01R, CLIN ED GENERAL SURGERY TRAY", description: "Clinical Education General Surgery Tray (Replacement)", category: "Clinical Education", image: "", specs: { "Item Number": "777044901" } },
      { name: "LCE02, CLIN ED HYSTERECTOMY TRAY", description: "Clinical Education Hysterectomy Tray", category: "Clinical Education", image: "", specs: { "Item Number": "777034701" } },
      { name: "LCE02R, CLIN ED HYSTERECTOMY TRAY", description: "Clinical Education Hysterectomy Tray (Replacement)", category: "Clinical Education", image: "", specs: { "Item Number": "777045001" } },
      { name: "LCE03, CLIN ED GASTRIC SLEEVE TRAY", description: "Clinical Education Gastric Sleeve Tray", category: "Clinical Education", image: "", specs: { "Item Number": "777035001" } },
      { name: "LCE03R, CLIN ED GASTRIC SLEEVE TRAY", description: "Clinical Education Gastric Sleeve Tray (Replacement)", category: "Clinical Education", image: "", specs: { "Item Number": "777045101" } },
      { name: "LCE04, CLIN ED REMOVABLE LIVER", description: "Clinical Education Removable Liver", category: "Clinical Education", image: "", specs: { "Item Number": "777052001" } },
      { name: "LCE04R, CLIN ED REMOVABLE LIVER", description: "Clinical Education Removable Liver (Replacement)", category: "Clinical Education", image: "", specs: { "Item Number": "777052004" } },
      { name: "LCE05, CLIN ED GYN PATHOLOGY TRAY", description: "Clinical Education GYN Pathology Tray", category: "Clinical Education", image: "", specs: { "Item Number": "777052039" } },
      { name: "LCE05R, CLIN ED GYN PATHOLOGY TRAY", description: "Clinical Education GYN Pathology Tray (Replacement)", category: "Clinical Education", image: "", specs: { "Item Number": "777052055" } },
    ];

    const { data: insertedProducts, error: prodError } = await supabase
      .from("products")
      .insert(products)
      .select("id");

    if (prodError) {
      console.error("Product insert error:", prodError);
      return new Response(JSON.stringify({ error: prodError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Make all products visible to all stakeholders
    if (insertedProducts && userIds.length > 0) {
      const visibilityRows = insertedProducts.flatMap((p: any) =>
        userIds.map((uid) => ({ product_id: p.id, user_id: uid }))
      );
      const { error: visError } = await supabase.from("product_visibility").insert(visibilityRows);
      if (visError) console.error("Visibility insert error:", visError);
    }

    return new Response(
      JSON.stringify({ message: "Seeded successfully", products: insertedProducts?.length, users: userIds.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Seed error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
