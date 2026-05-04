function showBootError(message) {
    const root = document.getElementById("root");
    if (root) {
        root.innerHTML = `<main style="padding:24px;font-family:Arial,sans-serif"><h1 style="margin:0 0 12px">Frontend failed to start</h1><p style="margin:0;color:#6d6458">${message}</p></main>`;
    }
}

if (!window.React || !window.ReactDOM) {
    showBootError("React failed to load. Check your internet connection and reload the page.");
    throw new Error("React or ReactDOM is not available.");
}

const { createElement: h, useEffect, useMemo, useState } = React;

const API_BASE = "/users";

const emptyForm = {
    name: "",
    age: "",
    email: ""
};

function statCard(label, value) {
    return h("div", { className: "stat-card" }, [
        h("span", { key: "label" }, label),
        h("strong", { key: "value" }, value)
    ]);
}

function detailItem(label, value) {
    return h("div", { className: "detail-item", key: label }, [
        h("span", { key: "label" }, label),
        h("strong", { key: "value" }, value)
    ]);
}

function App() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("Loading users...");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(API_BASE);
            if (!response.ok) {
                throw new Error("Could not load users.");
            }

            const data = await response.json();
            setUsers(data);
            setSelectedUser((current) => {
                if (!current) {
                    return data[0] || null;
                }

                return data.find((item) => item.id === current.id) || data[0] || null;
            });
            setStatus(`Loaded ${data.length} user${data.length === 1 ? "" : "s"}.`);
        } catch (fetchError) {
            setError("Backend not reachable. Start the Spring Boot app and reload.");
            setStatus("");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!form.name.trim() || !form.email.trim() || !form.age) {
            setError("Name, age, and email are required.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const response = await fetch(API_BASE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: form.name.trim(),
                    age: Number(form.age),
                    email: form.email.trim()
                })
            });

            if (!response.ok) {
                throw new Error("Could not save user.");
            }

            const savedUser = await response.json();
            setForm(emptyForm);
            setStatus(`Saved ${savedUser.name}.`);
            await loadUsers();
            setSelectedUser(savedUser);
        } catch (submitError) {
            setError("Save failed. Check the backend and try again.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(userId) {
        setError("");

        try {
            const response = await fetch(`${API_BASE}/${userId}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Could not delete user.");
            }

            setStatus(`Deleted user #${userId}.`);
            await loadUsers();
        } catch (deleteError) {
            setError("Delete failed. Check the backend and try again.");
        }
    }

    async function handleSelect(userId) {
        setError("");

        try {
            const response = await fetch(`${API_BASE}/${userId}`);
            if (!response.ok) {
                throw new Error("Could not load user.");
            }

            const data = await response.json();
            setSelectedUser(data);
            setStatus(`Viewing ${data.name}.`);
        } catch (selectError) {
            setError("Could not load that user.");
        }
    }

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) {
            return users;
        }

        return users.filter((user) =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            String(user.id).includes(query)
        );
    }, [users, search]);

    const totalAge = users.reduce((sum, user) => sum + Number(user.age || 0), 0);
    const averageAge = users.length ? Math.round(totalAge / users.length) : 0;

    return h("main", { className: "app-shell" }, [
        h("section", { className: "hero", key: "hero" }, [
            h("div", { className: "hero-copy", key: "copy" }, [
                h("h1", { key: "title" }, "LearnIt User Desk"),
                h(
                    "p",
                    { key: "body" },
                    "A React frontend for the Spring Boot users API. Create, inspect, search, and remove records from one place."
                )
            ]),
            h("div", { className: "hero-stats", key: "stats" }, [
                statCard("Total users", String(users.length)),
                statCard("Average age", String(averageAge)),
                statCard("Selected user", selectedUser ? String(selectedUser.id) : "None"),
                statCard("Backend route", "/users")
            ])
        ]),
        h("section", { className: "workspace", key: "workspace" }, [
            h("div", { className: "stack", key: "stack" }, [
                h("section", { className: "form-panel", key: "form-panel" }, [
                    h("div", { className: "panel-head", key: "head" }, [
                        h("div", { key: "head-copy" }, [
                            h("h2", { key: "title" }, "Create user"),
                            h("p", { key: "text" }, "Add a new user to the in-memory H2 database.")
                        ])
                    ]),
                    h("form", { className: "user-form", onSubmit: handleSubmit, key: "form" }, [
                        h("div", { className: "field", key: "name-field" }, [
                            h("label", { htmlFor: "name", key: "label" }, "Name"),
                            h("input", {
                                id: "name",
                                type: "text",
                                value: form.name,
                                onChange: (event) => setForm({ ...form, name: event.target.value }),
                                placeholder: "Asha Raman",
                                key: "input"
                            })
                        ]),
                        h("div", { className: "field", key: "age-field" }, [
                            h("label", { htmlFor: "age", key: "label" }, "Age"),
                            h("input", {
                                id: "age",
                                type: "number",
                                min: "1",
                                value: form.age,
                                onChange: (event) => setForm({ ...form, age: event.target.value }),
                                placeholder: "26",
                                key: "input"
                            })
                        ]),
                        h("div", { className: "field", key: "email-field" }, [
                            h("label", { htmlFor: "email", key: "label" }, "Email"),
                            h("input", {
                                id: "email",
                                type: "email",
                                value: form.email,
                                onChange: (event) => setForm({ ...form, email: event.target.value }),
                                placeholder: "asha@example.com",
                                key: "input"
                            })
                        ]),
                        h("div", { className: "actions", key: "actions" }, [
                            h(
                                "button",
                                {
                                    className: "button button-primary",
                                    type: "submit",
                                    disabled: submitting,
                                    key: "save"
                                },
                                submitting ? "Saving..." : "Save user"
                            ),
                            h(
                                "button",
                                {
                                    className: "button button-secondary",
                                    type: "button",
                                    onClick: () => setForm(emptyForm),
                                    key: "clear"
                                },
                                "Clear"
                            )
                        ])
                    ])
                ]),
                h("section", { className: "detail-panel", key: "detail-panel" }, [
                    h("h2", { key: "title" }, "Selected user"),
                    selectedUser
                        ? h("div", { className: "detail-grid", key: "grid" }, [
                            detailItem("ID", String(selectedUser.id)),
                            detailItem("Name", selectedUser.name),
                            detailItem("Age", String(selectedUser.age)),
                            detailItem("Email", selectedUser.email)
                        ])
                        : h("p", { className: "empty-state", key: "empty" }, "No user selected yet.")
                ])
            ]),
            h("section", { className: "list-panel", key: "list-panel" }, [
                h("div", { className: "panel-head", key: "head" }, [
                    h("div", { key: "copy" }, [
                        h("h2", { key: "title" }, "User list"),
                        h("p", { key: "text" }, "Browse and manage the current records.")
                    ])
                ]),
                h("div", { className: `status-bar${error ? " error" : ""}`, key: "status" }, error || status),
                h("div", { className: "toolbar", key: "toolbar" }, [
                    h("input", {
                        type: "search",
                        value: search,
                        onChange: (event) => setSearch(event.target.value),
                        placeholder: "Search by name, email, or id",
                        key: "search"
                    }),
                    h(
                        "button",
                        {
                            className: "button button-secondary",
                            type: "button",
                            onClick: loadUsers,
                            key: "refresh"
                        },
                        "Refresh"
                    )
                ]),
                loading
                    ? h("p", { className: "empty-state", key: "loading" }, "Loading records...")
                    : filteredUsers.length
                        ? h("div", { className: "user-grid", key: "grid" }, filteredUsers.map((user) =>
                            h("article", { className: "user-card", key: user.id }, [
                                h("div", { className: "user-badge", key: "badge" }, user.name.slice(0, 1).toUpperCase()),
                                h("div", { className: "user-meta", key: "meta" }, [
                                    h("h3", { key: "name" }, user.name),
                                    h("p", { key: "email" }, user.email),
                                    h("p", { key: "stats" }, `Age ${user.age} | ID ${user.id}`)
                                ]),
                                h("div", { className: "user-controls", key: "controls" }, [
                                    h(
                                        "button",
                                        {
                                            className: "button-chip",
                                            type: "button",
                                            onClick: () => handleSelect(user.id),
                                            key: "view"
                                        },
                                        "View"
                                    ),
                                    h(
                                        "button",
                                        {
                                            className: "button-chip",
                                            type: "button",
                                            onClick: () => setForm({
                                                name: user.name,
                                                age: String(user.age),
                                                email: user.email
                                            }),
                                            key: "reuse"
                                        },
                                        "Reuse"
                                    ),
                                    h(
                                        "button",
                                        {
                                            className: "button-chip button-danger",
                                            type: "button",
                                            onClick: () => handleDelete(user.id),
                                            key: "delete"
                                        },
                                        "Delete"
                                    )
                                ])
                            ])
                        ))
                        : h("p", { className: "empty-state", key: "empty" }, "No users match the current search.")
            ])
        ])
    ]);
}

try {
    ReactDOM.createRoot(document.getElementById("root")).render(h(App));
} catch (error) {
    showBootError(`Application error: ${error.message}`);
    throw error;
}
