//app/(components)/EditTicketForm.jsx
"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const EditTicketForm = ({ ticket }) => {
  const EDITMODE = ticket._id === "new" ? false : true;
  const router = useRouter();
  const startingTicketData = {
    title: "",
    description: "",
    priority: 1,
    progress: 0,
    status: "not started",
    category: "Miscellaneous",
  };

  if (EDITMODE) {
    startingTicketData["title"] = ticket.title;
    startingTicketData["description"] = ticket.description;
    startingTicketData["priority"] = ticket.priority;
    startingTicketData["progress"] = ticket.progress;
    startingTicketData["status"] = ticket.status;
    startingTicketData["category"] = ticket.category;
  }

  const [formData, setFormData] = useState(startingTicketData);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState(""); // Input for adding new category

  // Fetch categories from API when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setFormData((preState) => ({
      ...preState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (EDITMODE) {
      const res = await fetch(`/api/Tickets/${ticket._id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ formData }),
      });
      if (!res.ok) {
        throw new Error("Failed to update ticket");
      }
    } else {
      const res = await fetch("/api/Tickets", {
        method: "POST",
        body: JSON.stringify({ formData }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to create ticket");
      }
    }

    router.refresh();
    router.push("/");
  };

  // Function to add new category
  const addCategory = async () => {
    if (newCategory && !categories.includes(newCategory)) {
      try {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newCategory }),
        });

        if (!response.ok) throw new Error("Failed to add category");

        const data = await response.json();
        setCategories(data.categories); // Update categories state
        setNewCategory(""); // Clear input after adding
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  // Function to delete a category
  const deleteCategory = async (categoryToDelete) => {
    try {
      const response = await fetch("/api/categories", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryToDelete }),
      });

      if (!response.ok) throw new Error("Failed to delete category");

      const data = await response.json();
      setCategories(data.categories); // Update categories state after deletion
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        method="post"
        className="flex flex-col gap-3 w-full"
      >
        <h3>{EDITMODE ? "Update Your Ticket" : "Create New Ticket"}</h3>

        {/* Title */}
        {/*<label>Title</label>*/}
        <input
          id="title"
          name="title"
          type="text"
          placeholder="Title"
          onChange={handleChange}
          required={true}
          value={formData.title}
        />

        {/* Description */}
        {/*<label className="mt-0">Description</label>*/}
        <textarea
          id="description"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required={true}
          value={formData.description}
          rows="5"
        />

        {/* Category Selection */}
        <label className="mt-0">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories?.map((category, _index) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Add New Category */}
        <div className="category-management">
          {/*<label className="mr-2">New Category</label>*/}
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category"
          />
          <button
            className="ml-3 bg-slate-600 grey px-2 py-1 rounded-md hover:bg-slate-400 hover:text-black"
            type="button"
            onClick={addCategory}
          >
            Add
          </button>
        </div>

        {/* Delete Categories with Dropdown */}
        <div className="category-management">
          <details className="mb-4">
            <summary className="font-bold text-sm underline underline-offset-4 cursor-pointer">
              Delete Categories:
            </summary>
            <div className="mt-2">
              {categories.map((category, _index) => (
                <div
                  key={category._id}
                  className="flex justify-between text-sm"
                >
                  <span>{category.name}</span>
                  <button
                    className="bg-black-500 text-sm p-1 rounded-md mt-1"
                    type="button"
                    onClick={() => deleteCategory(category.name)} // Delete by name
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* Priority */}
        <label className="mt-0">Priority</label>
        <div>
          {[1, 2, 3, 4, 5].map((priority) => (
            <React.Fragment key={priority}>
              <input
                id={`priority-${priority}`}
                name="priority"
                type="radio"
                onChange={handleChange}
                value={priority}
                checked={formData.priority == priority}
              />
              <label>{priority}</label>
            </React.Fragment>
          ))}
        </div>

        {/* Progress */}
        <label className="mt-0">Progress</label>
        <input
          type="range"
          id="progress"
          name="progress"
          value={formData.progress}
          min="0"
          max="100"
          onChange={handleChange}
        />

        {/* Status */}
        <label className="mt-0">Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="not started">Not Started</option>
          <option value="on hold">On Hold</option>
          <option value="started">Started</option>
          <option value="done">Done</option>
        </select>

        {/* Submit Button */}
        <input
          type="submit"
          className="btn bg-green-700 hover:bg-green-600 text-white w-fit"
          value={EDITMODE ? "Update Ticket" : "Create Ticket"}
        />
      </form>
    </div>
  );
};

export default EditTicketForm;
