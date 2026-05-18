function showBootError(message) {
    const root = document.getElementById("root");
    if (root) {
        root.innerHTML = `<main style="padding:24px;font-family:'DM Sans',sans-serif"><h1 style="margin:0 0 12px">Frontend failed to start</h1><p style="margin:0;color:#6d6458">${message}</p></main>`;
    }
}

if (!window.React || !window.ReactDOM) {
    showBootError("React failed to load. Check your internet connection and reload the page.");
    throw new Error("React or ReactDOM is not available.");
}

const { createElement: h, useEffect, useMemo, useState } = React;

const API_BASE = "/users";

const emptyForm = { name: "", age: "", email: "" };

function statCard(label, value, icon) {
    return h("div", { className: "stat-card" }, [
        h("div", { className: "stat-icon", key: "icon" }, icon),
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
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { loadUsers(); }, []);

    async function loadUsers() {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(API_BASE);
            if (!response.ok) throw new Error("Could not load users.");
            const data = await response.json();
            setUsers(data);
            setSelectedUser((current) => {
                if (!current) return data[0] || null;
                return data.find((item) => item.id === current.id) || data[0] || null;
            });
            setStatus(`${data.length} user${data.length === 1 ? "" : "s"} loaded.`);
        } catch {
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
            let response;
            if (editingId) {
                // UPDATE existing user
                response = await fetch(`${API_BASE}/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: form.name.trim(),
                        age: Number(form.age),
                        email: form.email.trim()
                    })
                });
                if (!response.ok) throw new Error("Could not update user.");
                const updatedUser = await response.json();
                setStatus(`Updated ${updatedUser.name}.`);
                setEditingId(null);
                setSelectedUser(updatedUser);
            } else {
                // CREATE new user
                response = await fetch(API_BASE, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: form.name.trim(),
                        age: Number(form.age),
                        email: form.email.trim()
                    })
                });
                if (!response.ok) throw new Error("Could not save user.");
                const savedUser = await response.json();
                setStatus(`Saved ${savedUser.name}.`);
                setSelectedUser(savedUser);
            }
            setForm(emptyForm);
            await loadUsers();
        } catch {
            setError(editingId ? "Update failed. Check the backend and try again." : "Save failed. Check the backend and try again.");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(userId) {
        setError("");
        try {
            const response = await fetch(`${API_BASE}/${userId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Could not delete user.");
            setStatus(`Deleted user #${userId}.`);
            if (editingId === userId) { setEditingId(null); setForm(emptyForm); }
            await loadUsers();
        } catch {
            setError("Delete failed. Check the backend and try again.");
        }
    }

    async function handleSelect(userId) {
        setError("");
        try {
            const response = await fetch(`${API_BASE}/${userId}`);
            if (!response.ok) throw new Error("Could not load user.");
            const data = await response.json();
            setSelectedUser(data);
            setStatus(`Viewing ${data.name}.`);
        } catch {
            setError("Could not load that user.");
        }
    }

    function handleEdit(user) {
        setEditingId(user.id);
        setForm({ name: user.name, age: String(user.age), email: user.email });
        setError("");
        setStatus(`Editing ${user.name}. Make changes and click Update.`);
    }

    function handleCancelEdit() {
        setEditingId(null);
        setForm(emptyForm);
        setError("");
        setStatus("Edit cancelled.");
    }

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return users;
        return users.filter((user) =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            String(user.id).includes(query)
        );
    }, [users, search]);

    const totalAge = users.reduce((sum, user) => sum + Number(user.age || 0), 0);
    const averageAge = users.length ? Math.round(totalAge / users.length) : 0;

    return h("main", { className: "app-shell" }, [

        // HEADER
        h("header", { className: "app-header", key: "header" }, [
            h("div", { className: "header-brand", key: "brand" }, [
                h("div", { className: "header-logo", key: "logo" }, "LI"),
                h("div", { key: "title-wrap" }, [
                    h("h1", { key: "title" }, "LearnIt"),
                    h("span", { key: "sub" }, "User Management")
                ])
            ]),
            h("div", { className: "header-stats", key: "stats" }, [
                statCard("Total Users", String(users.length), "👥"),
                statCard("Avg Age", String(averageAge), "📊"),
                statCard("API Route", "/users", "🔗")
            ])
        ]),

        // MAIN CONTENT
        h("div", { className: "workspace", key: "workspace" }, [

            // LEFT PANEL - Form
            h("aside", { className: "side-panel", key: "side" }, [
                h("div", { className: "panel-card", key: "form-card" }, [
                    h("div", { className: "panel-card-header", key: "form-header" }, [
                        h("div", { className: `panel-card-icon ${editingId ? "editing" : ""}`, key: "icon" }, editingId ? "✏️" : "➕"),
                        h("div", { key: "hd" }, [
                            h("h2", { key: "title" }, editingId ? `Edit User #${editingId}` : "Create User"),
                            h("p", { key: "sub" }, editingId ? "Update the fields below." : "Add a new user record.")
                        ])
                    ]),
                    h("form", { className: "user-form", onSubmit: handleSubmit, key: "form" }, [
                        h("div", { className: "field", key: "name-field" }, [
                            h("label", { htmlFor: "name", key: "label" }, "Full Name"),
                            h("input", {
                                id: "name", type: "text", value: form.name,
                                onChange: (e) => setForm({ ...form, name: e.target.value }),
                                placeholder: "Asha Raman", key: "input"
                            })
                        ]),
                        h("div", { className: "field", key: "age-field" }, [
                            h("label", { htmlFor: "age", key: "label" }, "Age"),
                            h("input", {
                                id: "age", type: "number", min: "1", value: form.age,
                                onChange: (e) => setForm({ ...form, age: e.target.value }),
                                placeholder: "26", key: "input"
                            })
                        ]),
                        h("div", { className: "field", key: "email-field" }, [
                            h("label", { htmlFor: "email", key: "label" }, "Email Address"),
                            h("input", {
                                id: "email", type: "email", value: form.email,
                                onChange: (e) => setForm({ ...form, email: e.target.value }),
                                placeholder: "asha@example.com", key: "input"
                            })
                        ]),
                        h("div", { className: "actions", key: "actions" }, [
                            h("button", {
                                className: `btn btn-primary${editingId ? " btn-update" : ""}`,
                                type: "submit", disabled: submitting, key: "save"
                            }, submitting ? (editingId ? "Updating..." : "Saving...") : (editingId ? "Update User" : "Save User")),
                            editingId
                                ? h("button", {
                                    className: "btn btn-ghost", type: "button",
                                    onClick: handleCancelEdit, key: "cancel"
                                }, "Cancel")
                                : h("button", {
                                    className: "btn btn-ghost", type: "button",
                                    onClick: () => setForm(emptyForm), key: "clear"
                                }, "Clear")
                        ])
                    ])
                ]),

                // Selected User Detail
                selectedUser && h("div", { className: "panel-card detail-panel", key: "detail-card" }, [
                    h("div", { className: "panel-card-header", key: "dh" }, [
                        h("div", { className: "panel-card-icon", key: "icon" }, "👤"),
                        h("div", { key: "hd" }, [
                            h("h2", { key: "t" }, "Selected User"),
                            h("p", { key: "s" }, `ID #${selectedUser.id}`)
                        ])
                    ]),
                    h("div", { className: "detail-grid", key: "grid" }, [
                        detailItem("Name", selectedUser.name),
                        detailItem("Age", String(selectedUser.age)),
                        detailItem("Email", selectedUser.email)
                    ])
                ])
            ]),

            // RIGHT PANEL - User List
            h("section", { className: "list-panel", key: "list" }, [
                h("div", { className: "list-header", key: "lh" }, [
                    h("div", { key: "lh-copy" }, [
                        h("h2", { key: "title" }, "User Records"),
                        h("p", { key: "sub" }, "Browse, edit, and manage users.")
                    ]),
                    h("div", { className: "toolbar", key: "toolbar" }, [
                        h("div", { className: "search-wrap", key: "sw" }, [
                            h("span", { className: "search-icon", key: "si" }, "🔍"),
                            h("input", {
                                type: "search", value: search,
                                onChange: (e) => setSearch(e.target.value),
                                placeholder: "Search name, email or ID...",
                                key: "search"
                            })
                        ]),
                        h("button", {
                            className: "btn btn-ghost btn-icon", type: "button",
                            onClick: loadUsers, key: "refresh"
                        }, "↻ Refresh")
                    ])
                ]),

                h("div", { className: `status-strip${error ? " error" : ""}`, key: "status" },
                    error ? `⚠ ${error}` : status ? `✓ ${status}` : ""
                ),

                loading
                    ? h("div", { className: "loading-state", key: "loading" }, [
                        h("div", { className: "spinner", key: "sp" }),
                        h("p", { key: "lp" }, "Loading records...")
                    ])
                    : filteredUsers.length
                        ? h("div", { className: "user-grid", key: "grid" },
                            filteredUsers.map((user) =>
                                h("article", {
                                    className: `user-card${selectedUser && selectedUser.id === user.id ? " active" : ""}${editingId === user.id ? " editing" : ""}`,
                                    key: user.id
                                }, [
                                    h("div", { className: "user-avatar", key: "av" }, user.name.slice(0, 1).toUpperCase()),
                                    h("div", { className: "user-info", key: "info" }, [
                                        h("h3", { key: "name" }, user.name),
                                        h("p", { className: "user-email", key: "email" }, user.email),
                                        h("p", { className: "user-meta", key: "meta" }, `Age ${user.age}  ·  ID #${user.id}`)
                                    ]),
                                    h("div", { className: "user-actions", key: "acts" }, [
                                        h("button", {
                                            className: "chip", type: "button",
                                            onClick: () => handleSelect(user.id), key: "view"
                                        }, "View"),
                                        h("button", {
                                            className: "chip chip-edit", type: "button",
                                            onClick: () => handleEdit(user), key: "edit"
                                        }, "Edit"),
                                        h("button", {
                                            className: "chip chip-danger", type: "button",
                                            onClick: () => handleDelete(user.id), key: "del"
                                        }, "Delete")
                                    ])
                                ])
                            )
                        )
                        : h("div", { className: "empty-state", key: "empty" }, [
                            h("p", { key: "ep" }, "No users found.")
                        ])
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