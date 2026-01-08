import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import SaveConfirmationModal from "../common/SaveConfirmationModal";

export default function UserConfig() {
  const { user, setUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Estados para futuros campos editables
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    // Preparado para futuras funcionalidades
    profilePicture: null,
  });

  const handleSaveClick = () => {
    setShowConfirmModal(true);
  };

  const performSave = async () => {
    setIsLoading(true);
    setError("");
    setShowConfirmModal(false); // Close the modal

    try {
      const res = await fetch("http://localhost:3000/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token} `
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar perfil");
      }

      // Actualizar el contexto con los nuevos datos, manteniendo el token
      setUser({ ...data, token: user.token });
      setIsEditing(false);
      // Aquí podrías agregar un toast de éxito

    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-stone-600">Debes iniciar sesión para ver esta página</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-stone-200 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-6">
          <h1 className="text-3xl font-bold text-stone-800">Configuración de Usuario</h1>
          <p className="text-stone-700 mt-1">Gestiona tu perfil y preferencias</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">

          {/* Profile Picture Section - Preparado para futuro */}


          {/* Personal Information Section */}
          <div className="border-b border-stone-200 pb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-stone-800">Información Personal</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-amber-400 text-stone-800 rounded-lg hover:bg-amber-500 transition font-medium text-sm"
                >
                  Editar
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Nombre de Usuario
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                ) : (
                  <p className="px-4 py-2 bg-stone-50 rounded-lg text-stone-800">{user.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Correo Electrónico
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                ) : (
                  <p className="px-4 py-2 bg-stone-50 rounded-lg text-stone-800">{user.email || "No configurado"}</p>
                )}
              </div>

              {/* Action Buttons when editing */}
              {isEditing && (
                <div className="pt-4">
                  {error && (
                    <p className="text-red-500 text-sm mb-3">{error}</p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveClick}
                      disabled={isLoading}
                      className="px-6 py-2 bg-amber-400 text-stone-800 rounded-lg hover:bg-amber-500 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          username: user.username,
                          email: user.email || "",
                          profilePicture: null,
                        });
                        setError("");
                      }}
                      className="px-6 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Settings - Preparado para futuro */}
          <div>
            <h2 className="text-xl font-semibold text-stone-800 mb-4">Preferencias</h2>
            <div className="bg-stone-50 rounded-lg p-6 text-center">
              <p className="text-stone-500">Más opciones de configuración estarán disponibles próximamente</p>
            </div>
          </div>

        </div>
      </div>

      <SaveConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={performSave}
        title="¿Guardar cambios?"
        message="¿Estás seguro que deseas actualizar tu información personal? Esta acción modificará tus datos en el sistema."
      />
    </div>
  );
}
