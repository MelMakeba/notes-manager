CREATE OR REPLACE PROCEDURE delete_note(
    IN p_id UUID,
    OUT p_deleted BOOLEAN
)
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_rows INTEGER;
BEGIN
    DELETE FROM notes WHERE id = p_id;
    
    GET DIAGNOSTICS deleted_rows = ROW_COUNT;
    p_deleted := deleted_rows > 0;
END;
$$;