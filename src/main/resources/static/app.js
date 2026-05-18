function showBootError(message) {
    const root = document.getElementById("root");

    if (root) {
        root.innerHTML = `
            <main style="padding:24px;font-family:'DM Sans',sans-serif">
                <h1 style="margin:0 0 12px">
                    Frontend failed to start
                </h1>

                <p style="margin:0;color:#6d6458">
                    ${message}
                </p>
            </main>
        `;
    }
}

if (!window.React || !window.ReactDOM) {
    showBootError(
        "React failed to load. Check your internet connection and reload the page."
    );

    throw new Error("React or ReactDOM is not available.");
}

const {
    createElement: h,
    useEffect,
    useMemo,
    useState
} = React;

const API_BASE = "/users";

const emptyForm = {
    name: "",
    age: "",
    email: "",
    dob: ""
};

function formatDate(dob) {
    if (!dob) return "N/A";

    try {
        return new Date(dob).toLocaleDateString();
    } catch {
        return "Invalid Date";
    }
}

function detailItem(label, value) {
    return h("div", {
        className: "detail-item",
        key: label
    }, [

        h("span", {}, label),

        h("strong", {}, value)
    ]);
}

function App() {

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [form, setForm] = useState(emptyForm);

    const [status, setStatus] = useState("Loading users...");
    const [error, setError] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);

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

            setSelectedUser(data[0] || null);

            setStatus(
                `${data.length} user${data.length === 1 ? "" : "s"} loaded.`
            );

        } catch {

            setError(
                "Backend not reachable. Start Spring Boot and reload."
            );

            setStatus("");

        } finally {

            setLoading(false);
        }
    }

    async function handleSubmit(event) {

        event.preventDefault();

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.age
        ) {
            setError("Name, age and email are required.");
            return;
        }

        setSubmitting(true);

        setError("");

        try {

            let response;

            const payload = {
                name: form.name.trim(),
                age: Number(form.age),
                email: form.email.trim(),
                dob: form.dob || null
            };

            if (editingId) {

                response = await fetch(
                    `${API_BASE}/${editingId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(payload)
                    }
                );

                if (!response.ok) {
                    throw new Error("Update failed.");
                }

                const updatedUser = await response.json();

                setStatus(`Updated ${updatedUser.name}.`);

                setSelectedUser(updatedUser);

                setEditingId(null);

            } else {

                response = await fetch(API_BASE, {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error("Save failed.");
                }

                const savedUser = await response.json();

                setStatus(`Saved ${savedUser.name}.`);

                setSelectedUser(savedUser);
            }

            setForm(emptyForm);

            await loadUsers();

        } catch {

            setError(
                editingId
                    ? "Update failed."
                    : "Save failed."
            );

        } finally {

            setSubmitting(false);
        }
    }

    async function handleDelete(userId) {

        try {

            await fetch(`${API_BASE}/${userId}`, {
                method: "DELETE"
            });

            setStatus(`Deleted user #${userId}`);

            await loadUsers();

        } catch {

            setError("Delete failed.");
        }
    }

    function handleEdit(user) {

        setEditingId(user.id);

        setForm({
            name: user.name,
            age: String(user.age),
            email: user.email,
            dob: user.dob
                ? user.dob.split("T")[0]
                : ""
        });
    }

    return h("main", {
        className: "app-shell"
    }, [

        h("div", {
            className: "panel-card"
        }, [

            h("form", {
                className: "user-form",
                onSubmit: handleSubmit
            }, [

                h("div", {
                    className: "field"
                }, [

                    h("label", {}, "Name"),

                    h("input", {
                        placeholder: "Enter name",
                        value: form.name,

                        onChange: e =>
                            setForm({
                                ...form,
                                name: e.target.value
                            })
                    })
                ]),

                h("div", {
                    className: "field"
                }, [

                    h("label", {}, "Age"),

                    h("input", {
                        type: "number",
                        placeholder: "Enter age",
                        value: form.age,

                        onChange: e =>
                            setForm({
                                ...form,
                                age: e.target.value
                            })
                    })
                ]),

                h("div", {
                    className: "field"
                }, [

                    h("label", {}, "Email"),

                    h("input", {
                        placeholder: "Enter email",
                        value: form.email,

                        onChange: e =>
                            setForm({
                                ...form,
                                email: e.target.value
                            })
                    })
                ]),

                h("div", {
                    className: "field"
                }, [

                    h("label", {}, "Date of Birth"),

                    h("input", {
                        type: "date",
                        value: form.dob,

                        onChange: e =>
                            setForm({
                                ...form,
                                dob: e.target.value
                            })
                    })
                ]),

                h("div", {
                    className: "actions"
                }, [

                    h("button", {
                        type: "submit",

                        disabled: submitting,

                        className:
                            editingId
                                ? "btn btn-update"
                                : "btn btn-primary"

                    },
                        editingId
                            ? "Update User"
                            : "Create User"
                    )
                ])
            ])
        ]),

        error && h("div", {
            className: "status-strip error"
        }, error),

        !error && status && h("div", {
            className: "status-strip"
        }, status),

        selectedUser && h("div", {
            className: "panel-card detail-panel"
        }, [

            h("div", {
                className: "detail-grid"
            }, [

                detailItem(
                    "Name",
                    selectedUser.name
                ),

                detailItem(
                    "Email",
                    selectedUser.email
                ),

                detailItem(
                    "DOB",
                    formatDate(selectedUser?.dob)
                )
            ])
        ]),

        loading

            ? h("div", {
                className: "loading-state"
            }, [

                h("div", {
                    className: "spinner"
                }),

                h("p", {}, "Loading users...")
            ])

            : h("div", {
                className: "user-grid"
            },

                users.map(user =>

                    h("div", {

                        key: user.id,

                        className:
                            "user-card" +
                            (
                                selectedUser?.id === user.id
                                    ? " active"
                                    : ""
                            ) +
                            (
                                editingId === user.id
                                    ? " editing"
                                    : ""
                            )

                    }, [

                        h("div", {
                            className: "user-avatar"
                        },
                            user.name?.charAt(0)?.toUpperCase() || "?"
                        ),

                        h("div", {
                            className: "user-info"
                        }, [

                            h("h3", {}, user.name),

                            h("div", {
                                className: "user-email"
                            }, user.email),

                            h("div", {
                                className: "user-meta"
                            }, `Age: ${user.age}`)
                        ]),

                        h("div", {
                            className: "user-actions"
                        }, [

                            h("button", {

                                className: "chip chip-edit",

                                onClick: () =>
                                    handleEdit(user)

                            }, "Edit"),

                            h("button", {

                                className: "chip chip-danger",

                                onClick: () => setSelectedUser(user)

                            }, "View"),

                            h("button", {

                                className: "chip chip-danger",

                                onClick: () =>
                                    handleDelete(user.id)

                            }, "Delete")
                        ])
                    ])
                )
            )
    ]);
}

ReactDOM
    .createRoot(document.getElementById("root"))
    .render(h(App));