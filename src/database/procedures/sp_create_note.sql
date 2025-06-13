CREATE OR REPLACE FUNCTION create_note(
    note_title TEXT,
    note_content TEXT
) RETURNS TABLE (p_id UUID) AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO notes (title, content)
    VALUES (note_title, note_content)
    RETURNING id INTO new_id;
    
    RETURN QUERY SELECT new_id;
END;
$$ LANGUAGE plpgsql;
