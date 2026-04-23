DROP POLICY IF EXISTS "Stakeholders can read visible products" ON public.products;

CREATE POLICY "Stakeholders can read visible products"
ON public.products
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.product_visibility pv
    WHERE pv.product_id = products.id
      AND pv.user_id = auth.uid()
  )
);