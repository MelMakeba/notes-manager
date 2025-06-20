CREATE OR REPLACE FUNCTION create_note(
    note_title TEXT,
    note_content TEXT
) RETURNS UUID AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO notes (title, content)
    VALUES (note_title, note_content)
    RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;