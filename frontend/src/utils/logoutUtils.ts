import { useNavigate } from "react-router-dom";

type UserRole = "customer" | "admin" | "employee";

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async (userRole: UserRole = "customer") => {
    const roleEndpoints: Record<UserRole, string> = {
      customer: "/api/auth/logout",
      admin: "/api/admin/logout",
      employee: "/api/employee/logout",
    };

    try {
      // Call the appropriate logout endpoint
      const response = await fetch(roleEndpoints[userRole], {
        method: "POST",
        credentials: "include", // Important: sends cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Clear local storage/session
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();

        // Optional: Clear context if needed
        // You can dispatch context actions here if needed

        // Redirect to home/login
        navigate("/");
      } else {
        console.error("Logout failed:", response.statusText);
        // Still redirect even if backend fails
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect on error
      navigate("/");
    }
  };

  return handleLogout;
};
