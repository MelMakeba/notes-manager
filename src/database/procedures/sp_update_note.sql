CREATE OR REPLACE FUNCTION update_note(
    p_id UUID,
    p_title VARCHAR(255),
    p_content TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    updated_rows INTEGER;
BEGIN
    UPDATE notes
    SET 
        title = p_title, 
        content = p_content,
        updated_at = NOW()
    WHERE id = p_id;
    
    GET DIAGNOSTICS updated_rows = ROW_COUNT;
    RETURN updated_rows > 0;
END;
$$ LANGUAGE plpgsql;