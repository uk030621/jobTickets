"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Corrected: Added useRouter

const EditTicketForm = ({ ticket }) => {
  const EDITMODE = ticket && ticket._id !== "new";
  const startingTicketData = {
    title: ticket?.title || "",
    description: ticket?.description || "",
    priority: ticket?.priority || 1,
    progress: ticket?.progress || 0,
    status: ticket?.status || "not started",
    category: ticket?.category || "Miscellaneous",
  };

  const [formData, setFormData] = useState(startingTicketData);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const router = useRouter(); // Use useRouter to handle navigation

  // Fetch categories from the API
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

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = EDITMODE ? `/api/tickets/${ticket._id}` : "/api/tickets";
    const method = EDITMODE ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit ticket");
      }

      // After submitting, refresh or navigate
      router.refresh(); // Optionally refresh the data
      router.push("/"); // Redirect to the home page or tickets list
    } catch (error) {
      console.error(error);
    }
  };

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
        setCategories(data.categories);
        setNewCategory("");
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

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
      setCategories(data.categories);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-3/4">
        <h3>{EDITMODE ? "Update Your Ticket" : "Create New Ticket"}</h3>

        {/* Title */}
        <label>Title</label>
        <input
          id="title"
          name="title"
          type="text"
          onChange={handleChange}
          required
          value={formData.title}
        />

        {/* Description */}
        <label>Description</label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
          required
          value={formData.description}
          rows="5"
        />

        {/* Category */}
        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories?.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Add New Category */}
        <div className="category-management">
          <label>New Category</label>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category"
          />
          <button type="button" onClick={addCategory}>
            Add
          </button>
        </div>

        {/* Delete Category */}
        <div className="category-management">
          <label>Delete Categories</label>
          {categories.map((category, index) => (
            <div key={index} className="flex justify-between">
              <span>{category}</span>
              <button type="button" onClick={() => deleteCategory(category)}>
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Priority */}
        <label>Priority</label>
        <div>
          {[1, 2, 3, 4, 5].map((priority) => (
            <React.Fragment key={priority}>
              <input
                id={`priority-${priority}`}
                name="priority"
                type="radio"
                onChange={handleChange}
                value={priority}
                checked={formData.priority === priority}
              />
              <label>{priority}</label>
            </React.Fragment>
          ))}
        </div>

        {/* Progress */}
        <label>Progress</label>
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
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="not started">Not Started</option>
          <option value="on hold">On Hold</option>
          <option value="started">Started</option>
          <option value="done">Done</option>
        </select>

        {/* Submit */}
        <input
          type="submit"
          value={EDITMODE ? "Update Ticket" : "Create Ticket"}
        />
      </form>
    </div>
  );
};

export default EditTicketForm;
