import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :phoenix_tooltips, PhoenixTooltipsWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "9MaAwWhxOcS/a2UV7f6zCZADQgQFJgH7ggv40fUd5BkvyIgVNa9D1fZKgcGnBSiF",
  server: false

# Print only warnings and errors during test
config :logger, level: :warning

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
