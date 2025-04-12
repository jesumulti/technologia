import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import Select from "react-select";

const orgId = Cookies.get("orgId");
const roles = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
  { value: "editor", label: "Editor" },
];

const actions = [
  { value: "read", label: "Read" },
  { value: "write", label: "Write" },
  { value: "delete", label: "Delete" },
];

const pages = [
  { value: "/", label: "Home" },
  { value: "/dashboard", label: "Dashboard" },
  { value: "/settings", label: "Settings" },
];

export default function OrgPermissionsPage({orgId}: {orgId: string}) {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedActions, setSelectedActions] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orgId) {
      fetchPermissions();
    }
  }, [orgId]);

  const fetchPermissions = async () => {
    setLoading(true);
    const token = Cookies.get("token");
    if (!token) {
      console.error("No token found");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/get-permissions?org_id=${orgId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedRoles(
          roles.filter((role) => data.roles.includes(role.value))
        );
        setSelectedActions(
          actions.filter((action) => data.actions.includes(action.value))
        );
        setSelectedPages(
          pages.filter((page) => data.pages.includes(page.value))
        );
      } else {
        const errorData = await response.json();
        setErrorMessage(
          errorData.error || "Failed to fetch permissions. Setting defaults."
        );
        // Optionally set defaults if fetching fails
        setSelectedRoles([]);
        setSelectedActions([]);
        setSelectedPages([]);
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Error fetching permissions.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const permissions = selectedRoles.map((role: any) => ({
      role: role.value,
      actions: selectedActions.map((action: any) => action.value),
      pages: selectedPages.map((page: any) => page.value),
    }));
    console.log(permissions);
    };

    try {
      const response = await fetch(`/api/save-permissions?org_id=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": token,
        },
        body: JSON.stringify(permissions),
      });

      if (response.ok) {
        setSuccessMessage("Permissions saved successfully!");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to save permissions.");
      }
    } catch (error: any) {
      setErrorMessage(
        error.message || "An unexpected error occurred while saving permissions."
      );
    }
  };

  if (loading) {
    return <div>Loading permissions...</div>;
  } else {
    return (

        <h1>Org Permissions Page - Org ID: {id}</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Roles:</label>
            <Select
              isMulti
              options={roles}
              value={selectedRoles}
              onChange={(selectedOptions: any) =>
                setSelectedRoles(selectedOptions)
              }
            />
          </div>

          <div>
            <label>Actions:</label>
            <Select
              isMulti
              options={actions}
              value={selectedActions}
              onChange={(selectedOptions: any) =>
                setSelectedActions(selectedOptions)
              }
            />
          </div>

          <div>
            <label>Pages:</label>
            <Select
              isMulti
              options={pages}
              value={selectedPages}
              onChange={(selectedOptions: any) =>
                setSelectedPages(selectedOptions)
              }
            />
          </div>

          <button type="submit">Save Permissions</button>
        </form>

        {successMessage && (
          <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>
        )}

        {errorMessage && (
          <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
        )}
      </div>
    );
  }
}