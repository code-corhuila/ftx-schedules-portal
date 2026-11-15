
import { useState } from "react";
import "./App.css";

const courts = [
  { id: "c0000000-0000-4000-8000-000000000001", name: "Cancha 1" },
  { id: "c0000000-0000-4000-8000-000000000002", name: "Cancha 2" },
  { id: "c0000000-0000-4000-8000-000000000003", name: "Cancha 3" },
  { id: "c0000000-0000-4000-8000-000000000004", name: "Cancha 4" },
];

const days = [
  { code: "MON", name: "Lunes" },
  { code: "TUE", name: "Martes" },
  { code: "WED", name: "Miércoles" },
  { code: "THU", name: "Jueves" },
  { code: "FRI", name: "Viernes" },
  { code: "SAT", name: "Sábado" },
  { code: "SUN", name: "Domingo" },
];

const initialSchedules = Object.fromEntries(
  courts.map((court) => [
    court.id,
    Object.fromEntries(
      days.map((day) => [
        day.code,
        {
          openingTime: "06:00",
          closingTime: "22:00",
        },
      ]),
    ),
  ]),
);

function App() {
  const [selectedCourt, setSelectedCourt] = useState(courts[0].id);
  const [schedules, setSchedules] = useState(initialSchedules);
  const [editingDay, setEditingDay] = useState(null);
  const [openingTime, setOpeningTime] = useState("06:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const [message, setMessage] = useState("");

  const currentCourt = courts.find(
    (court) => court.id === selectedCourt,
  );

  const currentSchedules = schedules[selectedCourt];

  const openEditor = (dayCode) => {
    const schedule = currentSchedules[dayCode];

    setOpeningTime(schedule?.openingTime ?? "06:00");
    setClosingTime(schedule?.closingTime ?? "22:00");
    setEditingDay(dayCode);
    setMessage("");
  };

  const saveSchedule = () => {
    if (!openingTime || !closingTime) {
      setMessage("Debe seleccionar las horas de apertura y cierre.");
      return;
    }

    if (closingTime <= openingTime) {
      setMessage("La hora de cierre debe ser posterior a la apertura.");
      return;
    }

    setSchedules((previous) => ({
      ...previous,
      [selectedCourt]: {
        ...previous[selectedCourt],
        [editingDay]: {
          openingTime,
          closingTime,
        },
      },
    }));

    setEditingDay(null);
    setMessage("Horario actualizado en esta vista de demostración.");
  };

  const closeDay = (dayCode) => {
    const day = days.find((item) => item.code === dayCode);

    const confirmed = window.confirm(
      `¿Desea cerrar ${day.name}? Se eliminará su horario.`,
    );

    if (!confirmed) return;

    setSchedules((previous) => {
      const updatedSchedules = {
        ...previous[selectedCourt],
      };

      delete updatedSchedules[dayCode];

      return {
        ...previous,
        [selectedCourt]: updatedSchedules,
      };
    });

    setEditingDay(null);
    setMessage(`${day.name} quedó marcado como cerrado en esta demostración.`);
  };

  const changeCourt = (event) => {
    setSelectedCourt(event.target.value);
    setEditingDay(null);
    setMessage("");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">F</div>

          <div>
            <strong>FUTBOLIX</strong>
            <span>Panel administrativo</span>
          </div>
        </div>

        <div className="sidebar-section">ADMINISTRACIÓN</div>

        <nav className="navigation">
          <a href="#" className="nav-item">
            <span className="nav-icon">▦</span>
            Panel principal
          </a>

          <a href="#" className="nav-item">
            <span className="nav-icon">⚽</span>
            Canchas
          </a>

          <a href="/admin/schedules" className="nav-item active">
            <span className="nav-icon">◷</span>
            Horarios
          </a>

          <a href="#" className="nav-item">
            <span className="nav-icon">▤</span>
            Reservas
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="admin-avatar">A</div>

          <div className="admin-info">
            <strong>Administrador</strong>
            <span>Acceso administrativo</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Administración <span>/</span> Horarios
          </div>

          <div className="admin-pill">
            <span className="status-dot" />
            Administrador
          </div>
        </header>

        <section className="page-content">
          <div className="page-heading">
            <div>
              <span className="eyebrow">GESTIÓN DE CANCHAS</span>
              <h1>Horarios de atención</h1>
              <p>
                Configure los horarios de apertura y cierre de cada cancha.
              </p>
            </div>

            <div className="heading-icon">◷</div>
          </div>

          <section className="court-selector card">
            <div className="selector-description">
              <span className="section-icon">⚽</span>

              <div>
                <strong>Cancha seleccionada</strong>
                <span>
                  Seleccione la cancha que desea administrar.
                </span>
              </div>
            </div>

            <select
              value={selectedCourt}
              onChange={changeCourt}
              aria-label="Seleccionar cancha"
            >
              {courts.map((court) => (
                <option key={court.id} value={court.id}>
                  {court.name}
                </option>
              ))}
            </select>
          </section>

          <div className="schedule-heading">
            <div>
              <h2>Programación semanal</h2>
              <p>
                {currentCourt.name} · Horario de lunes a domingo
              </p>
            </div>

            <span className="week-badge">
              7 días de la semana
            </span>
          </div>

          <section className="schedule-list">
            {days.map((day) => {
              const schedule = currentSchedules[day.code];
              const isEditing = editingDay === day.code;

              return (
                <article
                  className={`day-card ${!schedule ? "day-closed" : ""}`}
                  key={day.code}
                >
                  <div className="day-name">
                    <span className="day-indicator" />
                    <strong>{day.name}</strong>
                  </div>

                  {isEditing ? (
                    <div className="editor">
                      <label>
                        Apertura
                        <input
                          type="time"
                          value={openingTime}
                          onChange={(event) =>
                            setOpeningTime(event.target.value)
                          }
                        />
                      </label>

                      <label>
                        Cierre
                        <input
                          type="time"
                          value={closingTime}
                          onChange={(event) =>
                            setClosingTime(event.target.value)
                          }
                        />
                      </label>

                      <div className="editor-actions">
                        <button
                          type="button"
                          className="button button-light"
                          onClick={() => setEditingDay(null)}
                        >
                          Cancelar
                        </button>

                        <button
                          type="button"
                          className="button button-primary"
                          onClick={saveSchedule}
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="day-hours">
                        {schedule ? (
                          <>
                            <span className="hours-icon">◷</span>
                            <strong>{schedule.openingTime}</strong>
                            <span className="hours-separator">a</span>
                            <strong>{schedule.closingTime}</strong>
                          </>
                        ) : (
                          <span className="closed-label">
                            Día cerrado
                          </span>
                        )}
                      </div>

                      <div className="day-actions">
                        <button
                          type="button"
                          className="button button-light"
                          onClick={() => openEditor(day.code)}
                        >
                          {schedule ? "Editar horario" : "Definir horario"}
                        </button>

                        {schedule && (
                          <button
                            type="button"
                            className="button button-danger-light"
                            onClick={() => closeDay(day.code)}
                          >
                            Cerrar día
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </section>

          <div className="information">
            <span className="information-icon">i</span>

            <p>
              <strong>Importante:</strong> los días sin horario registrado
              se consideran cerrados. El horario de cierre debe ser
              posterior al de apertura.
            </p>
          </div>

          {message && (
            <div className="feedback" role="status">
              <span>{message}</span>

              <button
                type="button"
                onClick={() => setMessage("")}
                aria-label="Cerrar mensaje"
              >
                ×
              </button>
            </div>
          )}

          <footer className="page-footer">
            <span>Futbolix · Administración de horarios</span>
            <span>Gestión semanal de canchas</span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
