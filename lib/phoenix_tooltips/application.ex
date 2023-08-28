defmodule PhoenixTooltips.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      PhoenixTooltipsWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: PhoenixTooltips.PubSub},
      # Start the Endpoint (http/https)
      PhoenixTooltipsWeb.Endpoint
      # Start a worker by calling: PhoenixTooltips.Worker.start_link(arg)
      # {PhoenixTooltips.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: PhoenixTooltips.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    PhoenixTooltipsWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
