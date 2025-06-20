CREATE OR REPLACE FUNCTION delete_note(
    p_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    deleted_rows INTEGER;
BEGIN
    DELETE FROM notes 
    WHERE id = p_id;
    
    GET DIAGNOSTICS deleted_rows = ROW_COUNT;
    RETURN deleted_rows > 0;
END;
$$ LANGUAGE plpgsql;