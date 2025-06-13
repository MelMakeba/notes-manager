CREATE OR REPLACE FUNCTION get_note_by_id(p_id UUID)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY SELECT n.id, n.title, n.content, n.created_at FROM notes n WHERE n.id = p_id;
END;
$$;