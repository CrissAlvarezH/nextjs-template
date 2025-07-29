-- Insert initial credit packages
INSERT INTO "credit_packages" ("name", "credits", "price_cents", "is_active") 
SELECT * FROM (VALUES 
  ('Paquete Básico', 100, 200000, true),
  ('Paquete Popular', 250, 400000, true),
  ('Paquete Premium', 500, 600000, true)
) AS t(name, credits, price_cents, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM "credit_packages" WHERE "credit_packages"."name" = t.name
);