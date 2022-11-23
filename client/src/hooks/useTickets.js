import { useState, useEffect } from "react";

const initialSettings = {
  notaNegocio: {
    areasVisibles: {
      area1: true,
      area2: true,
      area3: true,
      area4: false,
    },
    totalInfo: {
      subtotal: true,
      descuento: true,
      total: true,
      efectivo: true,
      tarjeta: true,
      cambio: true,
    },
  },
  notaCliente: {
    logoTitle: "",
    logoSubtitle: "",
    infoAddress1: "",
    infoAddress2: "",
    infoAddress3: "",
    infoTel: "",
    infoWapp: "",
    footerMsg1: "",
    footerMsg2: "",
    footerMsg3: "",
  },
  notaResumen: {},
};
function useTickets() {
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    cargarSettings();
  }, []);

  const cargarSettings = () => {
    if (localStorage.getItem("settings")) {
      const parseSettings = JSON.parse(localStorage.getItem("settings"));
      setSettings({ ...parseSettings });
    } else {
      localStorage.setItem("settings", JSON.stringify(initialSettings));
    }
  };

  const changeNotaClienteSettings = (newSettings) => {
    const parseSettings = JSON.parse(localStorage.getItem("settings"));
    const newData = {
      ...parseSettings,
      notaCliente: newSettings,
    };
    localStorage.setItem("settings", JSON.stringify(newData));
    setSettings({ ...newData });
  };

  const changeNotaNegocioSettings = (newSettings) => {
    const parseSettings = JSON.parse(localStorage.getItem("settings"));
    const newData = {
      ...parseSettings,
      notaNegocio: {
        areasVisibles: newSettings.areasVisibles,
        totalInfo: newSettings.totalInfo,
      },
    };
    localStorage.setItem("settings", JSON.stringify(newData));
    setSettings({ ...newData });
  };

  return { settings, changeNotaNegocioSettings, changeNotaClienteSettings };
}

export default useTickets;
