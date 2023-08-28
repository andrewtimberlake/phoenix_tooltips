defmodule PhoenixTooltipsWeb.ErrorJSONTest do
  use PhoenixTooltipsWeb.ConnCase, async: true

  test "renders 404" do
    assert PhoenixTooltipsWeb.ErrorJSON.render("404.json", %{}) == %{errors: %{detail: "Not Found"}}
  end

  test "renders 500" do
    assert PhoenixTooltipsWeb.ErrorJSON.render("500.json", %{}) ==
             %{errors: %{detail: "Internal Server Error"}}
  end
end
