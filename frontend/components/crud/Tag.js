import { useState, useEffect } from "react";
import { getCookie } from "../../actions/auth";
import { createTag, getTags, removeTag } from "../../actions/tag";

const Tag = () => {
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false,
    tags: [], 
    removed: false,
    reload: false,
  });

  const { name, error, success, tags, removed, reload } = values;
  const token = getCookie("token");

  // Load tags on mount and reload
  useEffect(() => {
    loadTags();
  }, [reload]);

  const loadTags = async () => {
    try {
      const data = await getTags();
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, tags: data });
      }
    } catch (err) {
      console.error("Error loading tags:", err);
    }
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      name: e.target.value,
      error: false,
      success: false,
      removed: false,
      reload: false,
    });
  };

  const clickSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createTag(name , token);
      if (data?.error) {
        setValues({
          ...values,
          error: data.error,
          success: false,
          removed: false,
        });
      } else {
        setValues({
          ...values,
          name: "",
          error: false,
          success: true,
          removed: false,
          reload: !reload,
        });
      }
    } catch (err) {
      setValues({
        ...values,
        error: "Something went wrong. Please try again.",
        success: false,
        removed: false,
      });
    }
  };

  const deleteTag = async (slug) => {
    const answer = window.confirm("Are you sure you want to delete this tag?");
    if (answer) {
      try {
        const data = await removeTag(slug, token);
        if (data.error) {
          console.log(data.error);
        } else {
          setValues((prev) => ({
            ...prev,
            error: false,
            success: false,
            removed: true,
            reload: !prev.reload,
          }));
        }
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const showTags = () =>
    tags?.map((t, i) => (
      <button
        onDoubleClick={() => deleteTag(t.slug)}
        title="Double click to delete"
        key={i}
        className="btn btn-outline btn-primary w-[20%] m-2 mt-3"
      >
        {t.name}
      </button>
    ));

  const showSuccess = () =>
    success && <p className="text-success">Tag is created.</p>;

  const showError = () =>
    error && <p className="text-danger">{error}</p>;

  const showRemove = () =>
    removed && <p className="text-danger">Tag is removed.</p>;

  const mouseLeaveHandler = () => {
    setValues({
      ...values,
      error: false,
      success: false,
      removed: false, 
    });
  };

  const newTagForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange}
          value={name}
          required
        />
        <button type="submit" className="btn btn-primary mt-2">
          Submit
        </button>
      </div>
    </form>
  );

  return (
    <>
      {showSuccess()}
      {showError()}
      {showRemove()}
      <div onMouseMove={mouseLeaveHandler}>
        {newTagForm()}
        {showTags()}
      </div>
    </>
  );
};

export default Tag;
