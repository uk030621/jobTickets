"use client"; // This enables client-side rendering in Next.js components

import { useEffect, useState } from "react";
import EditTicketForm from "@/app/(components)/EditTicketForm";

const TicketPage = ({ params }) => {
  const [ticketData, setTicketData] = useState(null);
  const isEditMode = params.id !== "new";

  useEffect(() => {
    const fetchTicket = async () => {
      if (isEditMode) {
        try {
          const res = await fetch(
            `http://localhost:3000/api/Tickets/${params.id}`,
            { cache: "no-store" }
          );
          if (res.ok) {
            const data = await res.json();
            setTicketData(data.foundTicket);
          } else {
            console.error("Failed to fetch ticket");
          }
        } catch (error) {
          console.error("Error fetching ticket", error);
        }
      } else {
        setTicketData({ _id: "new" });
      }
    };

    fetchTicket();
  }, [isEditMode, params.id]);

  if (!ticketData) {
    return <div>Loading...</div>; // Display a loading message until ticketData is available
  }

  return <EditTicketForm ticket={ticketData} />;
};

export default TicketPage;
