import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import { isAuth, getCookie } from "../../actions/auth";
import {
  createCategory,
  getCategories,
  singleCategory,
  removeCategory,
} from "../../actions/category";

const Category = () => {
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false,
    categories: [],
    removed: false,
    reload:false
  });
  const { name, error, success, categories, removed ,reload} = values;
  const token = getCookie("token");
 console.log(token)
  const loadCategories = async () => {
    const data = await getCategories();
    if (data.error) {
      console.log(error);
    } else {
      console.log(data);
      setValues({ ...values, categories: data });
    }
  };

   const showSuccess= ()=>{
    if(success){
      return <p className="text-success">Category is created </p>
    }
   }
    const showError= ()=>{
    if(error){
      return <p className="text-danger">Error creating category .</p>
    }
   }

    const showRemove= ()=>{
    if(removed){
      return <p className="text-danger">Category is removed .</p>
    }
   }
 const deleteCategory = async (slug) => {
  const answer = window.confirm("Are you sure you want to delete this category?");
  if (answer) {
    try {
      const data = await removeCategory(slug, token); 
      if (data.error) {
        console.log(data.error);
      } else {
        setValues((prev) => ({
          ...prev,
          error: false,
          success: false,
          removed: !prev.removed,
          reload: !prev.reload,
        }));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }
};


const showCategories = () =>{
  return categories?.map((c , i)=>{
    return  <button onDoubleClick={()=>deleteCategory(c.slug)} title="Double click to delete" key={i} className="btn btn-outline btn-primary w-[20%] 
    m-2 mt-3">{c.name}</button>
  })
}

  useEffect(() => {
    loadCategories();
  }, [reload]);

 
  const handleChange = (e) => {
    setValues({
      ...values,
      name: e.target.value,
      error: false,
      success: false,
      removed: false,
      reload : false
    });
  };

  const clickSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await createCategory({ name }, token);

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
          reload:!reload ,
        });
        //   Router.push("/admin/crud/category-tag");
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
  const mouseLeaveHandler = e =>{
    setValues({...values , error:false , success:false , removed:""})
  }
  const newCategoryForm = () => (
    <form action="" onSubmit={clickSubmit}>
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
  return <>
  {showSuccess()}
  {showError()}
  {showRemove()}
  <div onMouseMove={mouseLeaveHandler}> {newCategoryForm()}{showCategories()}</div></>;
};
export default Category;
