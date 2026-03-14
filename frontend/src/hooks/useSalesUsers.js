import { useState, useEffect } from "react";
import { getUsers } from "../services/leadService";

export default function useSalesUsers(canAssign) {

  const [users, setUsers] = useState([]);

  useEffect(() => {

    if (!canAssign) return;

    const fetchUsers = async () => {

      try {

        const res = await getUsers();

        const salesUsers = res.data.data.filter(
          u => u.role === "sales"
        );

        setUsers(salesUsers);

      } catch (err) {

        console.error(err);

      }

    };

    fetchUsers();

  }, [canAssign]);

  return users;

}