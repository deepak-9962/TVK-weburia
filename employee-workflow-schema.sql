-- ============================================
-- TVK Employee Workflow - Database Schema
-- Areas and Parts Tables for Madhavaram Constituency
-- Created: October 5, 2025
-- ============================================

-- Drop existing tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS public.parts CASCADE;
DROP TABLE IF EXISTS public.areas CASCADE;

-- ============================================
-- Table: areas
-- Stores unique Area/Union/Town names
-- ============================================
CREATE TABLE public.areas (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Table: parts
-- Stores Part Numbers linked to Areas with additional details
-- ============================================
CREATE TABLE public.parts (
    id SERIAL PRIMARY KEY,
    part_number INTEGER UNIQUE NOT NULL,
    area_id INTEGER NOT NULL REFERENCES public.areas(id) ON DELETE CASCADE,
    ward_circle TEXT,  -- வட்டம் / ஊராட்சி / வார்டு
    serial_number INTEGER,  -- வரிசை எண்
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_parts_area_id ON public.parts(area_id);
CREATE INDEX idx_parts_part_number ON public.parts(part_number);

-- Enable Row Level Security (RLS)
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;

-- Create policies to allow read access to authenticated users
CREATE POLICY "Enable read access for all users" ON public.areas
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.parts
    FOR SELECT USING (true);

-- ============================================
-- INSERT DATA - Areas
-- ============================================

-- Madhavaram Area Parts
INSERT INTO public.areas (name) VALUES 
('Madhavaram North Part'),
('Madhavaram Central Part'),
('Madhavaram East Part'),
('Madhavaram South Part'),
('Madhavaram North-West Part'),
('Madhavaram West Part');

-- Puzhal Union Panchayats
INSERT INTO public.areas (name) VALUES 
('Puzhal Union - Theerthagiriyampattu Panchayat'),
('Puzhal Union - Vilangadupakkam Panchayat'),
('Puzhal Union - Sentrampakkam Panchayat'),
('Puzhal Union - Azhinjivakkam Panchayat'),
('Puzhal Union - Grand Line Panchayat'),
('Puzhal Union - Vadakarai Panchayat'),
('Puzhal Union - Pullilyon Panchayat');

-- Villivakkam Union Panchayats
INSERT INTO public.areas (name) VALUES 
('Villivakkam Union - Karalapakkam Panchayat'),
('Villivakkam Union - Pandeswaram Panchayat'),
('Villivakkam Union - Arakkambakkam Panchayat'),
('Villivakkam Union - Vellacheri Panchayat'),
('Villivakkam Union - Alathur Panchayat'),
('Villivakkam Union - Palavedu Panchayat'),
('Villivakkam Union - Veerapuram Panchayat'),
('Villivakkam Union - Vellanur Panchayat'),
('Villivakkam Union - Kollumedu Panchayat'),
('Villivakkam Union - Arikkambedu Panchayat'),
('Villivakkam Union - Konimedu Panchayat'),
('Villivakkam Union - Pammathukulam Panchayat'),
('Villivakkam Union - Pothur Panchayat');

-- Sholavaram Union Panchayats
INSERT INTO public.areas (name) VALUES 
('Sholavaram Union - Nerkundram Panchayat'),
('Sholavaram Union - Aathur Panchayat'),
('Sholavaram Union - Sothuperumbedu Panchayat'),
('Sholavaram Union - Karanodai Panchayat'),
('Sholavaram Union - Orakkadu Panchayat'),
('Sholavaram Union - Perungavur Panchayat'),
('Sholavaram Union - Pudur Panchayat'),
('Sholavaram Union - Sholavaram Panchayat'),
('Sholavaram Union - New and Old Erumaivettipalayam'),
('Sholavaram Union - Alamathi Panchayat'),
('Sholavaram Union - Attanthangal Panchayat'),
('Sholavaram Union - Nallur Panchayat'),
('Sholavaram Union - Angadu Panchayat'),
('Sholavaram Union - Kummanur Panchayat'),
('Sholavaram Union - Padianallur Panchayat');

-- Sengundram Town
INSERT INTO public.areas (name) VALUES 
('Sengundram Town - Naravarikuppam');

-- ============================================
-- INSERT DATA - Parts
-- Using area IDs based on insertion order
-- ============================================

-- Madhavaram North Part: Parts 1-12, 145-147, 164-193, 233-242
INSERT INTO public.parts (part_number, area_id) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1), (11, 1), (12, 1),
(145, 1), (146, 1), (147, 1),
(164, 1), (165, 1), (166, 1), (167, 1), (168, 1), (169, 1), (170, 1), (171, 1), (172, 1), (173, 1),
(174, 1), (175, 1), (176, 1), (177, 1), (178, 1), (179, 1), (180, 1), (181, 1), (182, 1), (183, 1),
(184, 1), (185, 1), (186, 1), (187, 1), (188, 1), (189, 1), (190, 1), (191, 1), (192, 1), (193, 1),
(233, 1), (234, 1), (235, 1), (236, 1), (237, 1), (238, 1), (239, 1), (240, 1), (241, 1), (242, 1);

-- Madhavaram Central Part: Parts 243-267
INSERT INTO public.parts (part_number, area_id) VALUES
(243, 2), (244, 2), (245, 2), (246, 2), (247, 2), (248, 2), (249, 2), (250, 2), (251, 2), (252, 2),
(253, 2), (254, 2), (255, 2), (256, 2), (257, 2), (258, 2), (259, 2), (260, 2), (261, 2), (262, 2),
(263, 2), (264, 2), (265, 2), (266, 2), (267, 2);

-- Madhavaram East Part: Parts 27, 29-59
INSERT INTO public.parts (part_number, area_id) VALUES
(27, 3), (29, 3), (30, 3), (31, 3), (32, 3), (33, 3), (34, 3), (35, 3), (36, 3), (37, 3),
(38, 3), (39, 3), (40, 3), (41, 3), (42, 3), (43, 3), (44, 3), (45, 3), (46, 3), (47, 3),
(48, 3), (49, 3), (50, 3), (51, 3), (52, 3), (53, 3), (54, 3), (55, 3), (56, 3), (57, 3),
(58, 3), (59, 3);

-- Madhavaram South Part: Parts 13-26, 28, 60-90, 97-99, 101, 102
INSERT INTO public.parts (part_number, area_id) VALUES
(13, 4), (14, 4), (15, 4), (16, 4), (17, 4), (18, 4), (19, 4), (20, 4), (21, 4), (22, 4),
(23, 4), (24, 4), (25, 4), (26, 4), (28, 4),
(60, 4), (61, 4), (62, 4), (63, 4), (64, 4), (65, 4), (66, 4), (67, 4), (68, 4), (69, 4),
(70, 4), (71, 4), (72, 4), (73, 4), (74, 4), (75, 4), (76, 4), (77, 4), (78, 4), (79, 4),
(80, 4), (81, 4), (82, 4), (83, 4), (84, 4), (85, 4), (86, 4), (87, 4), (88, 4), (89, 4), (90, 4),
(97, 4), (98, 4), (99, 4), (101, 4), (102, 4);

-- Madhavaram North-West Part: Parts 194-232
INSERT INTO public.parts (part_number, area_id) VALUES
(194, 5), (195, 5), (196, 5), (197, 5), (198, 5), (199, 5), (200, 5), (201, 5), (202, 5), (203, 5),
(204, 5), (205, 5), (206, 5), (207, 5), (208, 5), (209, 5), (210, 5), (211, 5), (212, 5), (213, 5),
(214, 5), (215, 5), (216, 5), (217, 5), (218, 5), (219, 5), (220, 5), (221, 5), (222, 5), (223, 5),
(224, 5), (225, 5), (226, 5), (227, 5), (228, 5), (229, 5), (230, 5), (231, 5), (232, 5);

-- Madhavaram West Part: Parts 91-96, 100, 103-128
INSERT INTO public.parts (part_number, area_id) VALUES
(91, 6), (92, 6), (93, 6), (94, 6), (95, 6), (96, 6), (100, 6),
(103, 6), (104, 6), (105, 6), (106, 6), (107, 6), (108, 6), (109, 6), (110, 6), (111, 6), (112, 6),
(113, 6), (114, 6), (115, 6), (116, 6), (117, 6), (118, 6), (119, 6), (120, 6), (121, 6), (122, 6),
(123, 6), (124, 6), (125, 6), (126, 6), (127, 6), (128, 6);

-- Puzhal Union - Theerthagiriyampattu Panchayat: Parts 129-136
INSERT INTO public.parts (part_number, area_id) VALUES
(129, 7), (130, 7), (131, 7), (132, 7), (133, 7), (134, 7), (135, 7), (136, 7);

-- Puzhal Union - Vilangadupakkam Panchayat: Parts 137-143
INSERT INTO public.parts (part_number, area_id) VALUES
(137, 8), (138, 8), (139, 8), (140, 8), (141, 8), (142, 8), (143, 8);

-- Puzhal Union - Sentrampakkam Panchayat: Part 144
INSERT INTO public.parts (part_number, area_id) VALUES (144, 9);

-- Puzhal Union - Azhinjivakkam Panchayat: Parts 148, 149
INSERT INTO public.parts (part_number, area_id) VALUES (148, 10), (149, 10);

-- Puzhal Union - Grand Line Panchayat: Parts 150-154
INSERT INTO public.parts (part_number, area_id) VALUES
(150, 11), (151, 11), (152, 11), (153, 11), (154, 11);

-- Puzhal Union - Vadakarai Panchayat: Parts 155-157
INSERT INTO public.parts (part_number, area_id) VALUES (155, 12), (156, 12), (157, 12);

-- Puzhal Union - Pullilyon Panchayat: Parts 158-163
INSERT INTO public.parts (part_number, area_id) VALUES
(158, 13), (159, 13), (160, 13), (161, 13), (162, 13), (163, 13);

-- Villivakkam Union - Karalapakkam Panchayat: Parts 296-298
INSERT INTO public.parts (part_number, area_id) VALUES (296, 14), (297, 14), (298, 14);

-- Villivakkam Union - Pandeswaram Panchayat: Parts 299, 300
INSERT INTO public.parts (part_number, area_id) VALUES (299, 15), (300, 15);

-- Villivakkam Union - Arakkambakkam Panchayat: Part 301
INSERT INTO public.parts (part_number, area_id) VALUES (301, 16);

-- Villivakkam Union - Vellacheri Panchayat: Parts 302, 303
INSERT INTO public.parts (part_number, area_id) VALUES (302, 17), (303, 17);

-- Villivakkam Union - Alathur Panchayat: Parts 304, 305
INSERT INTO public.parts (part_number, area_id) VALUES (304, 18), (305, 18);

-- Villivakkam Union - Palavedu Panchayat: Parts 306-312
INSERT INTO public.parts (part_number, area_id) VALUES
(306, 19), (307, 19), (308, 19), (309, 19), (310, 19), (311, 19), (312, 19);

-- Villivakkam Union - Veerapuram Panchayat: Parts 313-331
INSERT INTO public.parts (part_number, area_id) VALUES
(313, 20), (314, 20), (315, 20), (316, 20), (317, 20), (318, 20), (319, 20), (320, 20), (321, 20), (322, 20),
(323, 20), (324, 20), (325, 20), (326, 20), (327, 20), (328, 20), (329, 20), (330, 20), (331, 20);

-- Villivakkam Union - Vellanur Panchayat: Parts 332-337
INSERT INTO public.parts (part_number, area_id) VALUES
(332, 21), (333, 21), (334, 21), (335, 21), (336, 21), (337, 21);

-- Villivakkam Union - Kollumedu Panchayat: Parts 338-342
INSERT INTO public.parts (part_number, area_id) VALUES
(338, 22), (339, 22), (340, 22), (341, 22), (342, 22);

-- Villivakkam Union - Arikkambedu Panchayat: Parts 343-346
INSERT INTO public.parts (part_number, area_id) VALUES (343, 23), (344, 23), (345, 23), (346, 23);

-- Villivakkam Union - Konimedu Panchayat: Parts 347-350
INSERT INTO public.parts (part_number, area_id) VALUES (347, 24), (348, 24), (349, 24), (350, 24);

-- Villivakkam Union - Pammathukulam Panchayat: Parts 351-357
INSERT INTO public.parts (part_number, area_id) VALUES
(351, 25), (352, 25), (353, 25), (354, 25), (355, 25), (356, 25), (357, 25);

-- Villivakkam Union - Pothur Panchayat: Parts 358-361
INSERT INTO public.parts (part_number, area_id) VALUES (358, 26), (359, 26), (360, 26), (361, 26);

-- Sholavaram Union - Nerkundram Panchayat: Parts 362, 363
INSERT INTO public.parts (part_number, area_id) VALUES (362, 27), (363, 27);

-- Sholavaram Union - Aathur Panchayat: Parts 364-367
INSERT INTO public.parts (part_number, area_id) VALUES (364, 28), (365, 28), (366, 28), (367, 28);

-- Sholavaram Union - Sothuperumbedu Panchayat: Part 368
INSERT INTO public.parts (part_number, area_id) VALUES (368, 29);

-- Sholavaram Union - Karanodai Panchayat: Parts 369-373
INSERT INTO public.parts (part_number, area_id) VALUES (369, 30), (370, 30), (371, 30), (372, 30), (373, 30);

-- Sholavaram Union - Orakkadu Panchayat: Parts 374, 375
INSERT INTO public.parts (part_number, area_id) VALUES (374, 31), (375, 31);

-- Sholavaram Union - Perungavur Panchayat: Parts 376, 377
INSERT INTO public.parts (part_number, area_id) VALUES (376, 32), (377, 32);

-- Sholavaram Union - Pudur Panchayat: Parts 378-380
INSERT INTO public.parts (part_number, area_id) VALUES (378, 33), (379, 33), (380, 33);

-- Sholavaram Union - Sholavaram Panchayat: Parts 381-392
INSERT INTO public.parts (part_number, area_id) VALUES
(381, 34), (382, 34), (383, 34), (384, 34), (385, 34), (386, 34), (387, 34), (388, 34), (389, 34), (390, 34),
(391, 34), (392, 34);

-- Sholavaram Union - New and Old Erumaivettipalayam: Parts 393-395
INSERT INTO public.parts (part_number, area_id) VALUES (393, 35), (394, 35), (395, 35);

-- Sholavaram Union - Alamathi Panchayat: Parts 396-407
INSERT INTO public.parts (part_number, area_id) VALUES
(396, 36), (397, 36), (398, 36), (399, 36), (400, 36), (401, 36), (402, 36), (403, 36), (404, 36), (405, 36),
(406, 36), (407, 36);

-- Sholavaram Union - Attanthangal Panchayat: Parts 408, 409, 416-424, 432-438
INSERT INTO public.parts (part_number, area_id) VALUES
(408, 37), (409, 37),
(416, 37), (417, 37), (418, 37), (419, 37), (420, 37), (421, 37), (422, 37), (423, 37), (424, 37),
(432, 37), (433, 37), (434, 37), (435, 37), (436, 37), (437, 37), (438, 37);

-- Sholavaram Union - Nallur Panchayat: Parts 410-415, 425-431, 439, 440
INSERT INTO public.parts (part_number, area_id) VALUES
(410, 38), (411, 38), (412, 38), (413, 38), (414, 38), (415, 38),
(425, 38), (426, 38), (427, 38), (428, 38), (429, 38), (430, 38), (431, 38),
(439, 38), (440, 38);

-- Sholavaram Union - Angadu Panchayat: Parts 441-443
INSERT INTO public.parts (part_number, area_id) VALUES (441, 39), (442, 39), (443, 39);

-- Sholavaram Union - Kummanur Panchayat: Parts 444, 445
INSERT INTO public.parts (part_number, area_id) VALUES (444, 40), (445, 40);

-- Sholavaram Union - Padianallur Panchayat: Parts 446-475
INSERT INTO public.parts (part_number, area_id) VALUES
(446, 41), (447, 41), (448, 41), (449, 41), (450, 41), (451, 41), (452, 41), (453, 41), (454, 41), (455, 41),
(456, 41), (457, 41), (458, 41), (459, 41), (460, 41), (461, 41), (462, 41), (463, 41), (464, 41), (465, 41),
(466, 41), (467, 41), (468, 41), (469, 41), (470, 41), (471, 41), (472, 41), (473, 41), (474, 41), (475, 41);

-- Sengundram Town - Naravarikuppam: Parts 268-295
INSERT INTO public.parts (part_number, area_id) VALUES
(268, 42), (269, 42), (270, 42), (271, 42), (272, 42), (273, 42), (274, 42), (275, 42), (276, 42), (277, 42),
(278, 42), (279, 42), (280, 42), (281, 42), (282, 42), (283, 42), (284, 42), (285, 42), (286, 42), (287, 42),
(288, 42), (289, 42), (290, 42), (291, 42), (292, 42), (293, 42), (294, 42), (295, 42);

-- ============================================
-- Verification Queries
-- ============================================

-- Count total areas (should be 42)
-- SELECT COUNT(*) as total_areas FROM public.areas;

-- Count total parts (should be 475)
-- SELECT COUNT(*) as total_parts FROM public.parts;

-- View all areas with their part counts
-- SELECT a.id, a.name, COUNT(p.id) as part_count
-- FROM public.areas a
-- LEFT JOIN public.parts p ON a.id = p.area_id
-- GROUP BY a.id, a.name
-- ORDER BY a.id;

-- View all parts for a specific area (example: area_id = 1)
-- SELECT p.part_number, a.name as area_name
-- FROM public.parts p
-- JOIN public.areas a ON p.area_id = a.id
-- WHERE a.id = 1
-- ORDER BY p.part_number;
