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
        className="flex flex-col gap-3 w-3/4"
      >
        <h3>{EDITMODE ? "Update Your Ticket" : "Create New Ticket"}</h3>

        {/* Title */}
        <label>Title</label>
        <input
          id="title"
          name="title"
          type="text"
          onChange={handleChange}
          required={true}
          value={formData.title}
        />

        {/* Description */}
        <label>Description</label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
          required={true}
          value={formData.description}
          rows="5"
        />

        {/* Category Selection */}
        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories?.map((category, _index) => (
            <option key={_index} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Add New Category */}
        <div className="category-management">
          <label className="mr-2">Add New Category</label>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category"
          />
          <button
            className="ml-3 bg-green-400 p-1 rounded-md"
            type="button"
            onClick={addCategory}
          >
            Add Category
          </button>
        </div>

        {/* Delete Categories */}
        <div className="category-management">
          <div className="mb-4">
            <label className="font-bold">Delete Categories</label>
          </div>
          {categories.map((category, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{category}</span>
              <button
                className="bg-red-500 text-sm p-1 rounded-md mt-1"
                type="button"
                onClick={() => deleteCategory(category)}
              >
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
                checked={formData.priority == priority}
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

        {/* Submit Button */}
        <input
          type="submit"
          className="btn max-w-xs"
          value={EDITMODE ? "Update Ticket" : "Create Ticket"}
        />
      </form>
    </div>
  );
};

export default EditTicketForm;
