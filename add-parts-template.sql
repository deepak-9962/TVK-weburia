-- ============================================
-- QUICK ADD TEMPLATE
-- Use this to quickly add more parts from your PDF
-- ============================================

-- ============================================
-- STEP 1: Add New Area
-- ============================================
-- Copy this template and fill in the details:

/*
INSERT INTO public.areas (id, name) VALUES 
(AREA_ID, 'AREA_NAME_IN_TAMIL');

Example:
INSERT INTO public.areas (id, name) VALUES 
(2, 'புழல் ஒன்றியம்');
*/

-- ============================================
-- STEP 2: Add Parts for That Area
-- ============================================
-- Copy this template for each ward/circle:

/*
-- Area: AREA_NAME, Ward: WARD_NUMBER
INSERT INTO public.parts (part_number, area_id, ward_circle, serial_number) VALUES
(PART_NUM_1, AREA_ID, 'WARD', SERIAL_NUM),
(PART_NUM_2, AREA_ID, 'WARD', SERIAL_NUM),
(PART_NUM_3, AREA_ID, 'WARD', SERIAL_NUM);

Example:
-- Area: புழல் ஒன்றியம், Ward: 5
INSERT INTO public.parts (part_number, area_id, ward_circle, serial_number) VALUES
(50, 2, '5', 2),
(51, 2, '5', 2),
(52, 2, '5', 2);
*/

-- ============================================
-- VERIFICATION AFTER ADDING
-- ============================================
-- Run these queries to verify your additions:

-- Count total parts
SELECT COUNT(*) as total_parts FROM parts;

-- Count parts per area
SELECT a.name, COUNT(p.id) as part_count 
FROM areas a 
LEFT JOIN parts p ON a.id = p.area_id 
GROUP BY a.name 
ORDER BY a.id;

-- View all parts for a specific area
SELECT p.part_number, a.name as area_name, p.ward_circle, p.serial_number
FROM parts p 
JOIN areas a ON p.area_id = a.id 
WHERE a.name = 'மாதவரம்'
ORDER BY p.part_number;

-- Test lookup for specific part number
SELECT p.part_number, a.name as area_name, p.ward_circle 
FROM parts p 
JOIN areas a ON p.area_id = a.id 
WHERE p.part_number = 145;

-- ============================================
-- EXAMPLE: Adding a complete area
-- ============================================

-- Add new area
INSERT INTO public.areas (id, name) VALUES 
(2, 'புழல் ஒன்றியம்');

-- Add parts for ward 1
INSERT INTO public.parts (part_number, area_id, ward_circle, serial_number) VALUES
(13, 2, '1', 2),
(14, 2, '1', 2),
(15, 2, '1', 2);

-- Add parts for ward 2
INSERT INTO public.parts (part_number, area_id, ward_circle, serial_number) VALUES
(16, 2, '2', 2),
(17, 2, '2', 2),
(18, 2, '2', 2);

-- ============================================
-- BULK INSERT HELPER
-- ============================================
-- If you have many consecutive part numbers in same ward:

/*
-- Generate sequence of parts (PostgreSQL function)
INSERT INTO public.parts (part_number, area_id, ward_circle, serial_number)
SELECT generate_series(START_NUM, END_NUM), AREA_ID, 'WARD', SERIAL_NUM;

Example: Add parts 166-193 all at once:
INSERT INTO public.parts (part_number, area_id, ward_circle, serial_number)
SELECT generate_series(166, 193), 1, '19', 1;
*/

-- ============================================
-- DATA VALIDATION QUERIES
-- ============================================

-- Find duplicate part numbers (should return 0 rows)
SELECT part_number, COUNT(*) 
FROM parts 
GROUP BY part_number 
HAVING COUNT(*) > 1;

-- Find parts without area (should return 0 rows)
SELECT * FROM parts WHERE area_id IS NULL;

-- Find parts with missing ward info
SELECT part_number, area_id FROM parts WHERE ward_circle IS NULL OR ward_circle = '';

-- View parts range per ward
SELECT a.name, p.ward_circle, 
       MIN(p.part_number) as first_part, 
       MAX(p.part_number) as last_part,
       COUNT(*) as total_parts
FROM parts p
JOIN areas a ON p.area_id = a.id
GROUP BY a.name, p.ward_circle
ORDER BY a.name, p.ward_circle;
