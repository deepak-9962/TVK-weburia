-- Export all members to JSON format
-- Copy the ENTIRE result (it will be one big JSON array)
-- Save it to members-data.json

SELECT json_agg(row_to_json(t)) 
FROM (
  SELECT 
    id,
    full_name,
    father_name,
    photo_url,
    town,
    gender,
    member_category,
    status,
    created_at,
    date_of_birth,
    mobile,
    voter_id,
    part_number,
    membership_number,
    address,
    ward_circle
  FROM bla_members
  ORDER BY created_at DESC
) t;
