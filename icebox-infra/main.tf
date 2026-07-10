terraform {
    required_providers {
        azurerm = {
            source = "hashicorp/azurerm"
            version = "~> 3.0"
        }
    }
}

provider "azurerm" {
    features {}
}

resource "azurerm_resource_group" "icebox_rg" {
    name     = "icebox-rg"
    location = "centralus"
}

resource "azurerm_service_plan" "icebox_plan" {
    name = "plan-icebox-free"
    resource_group_name = azurerm_resource_group.icebox_rg.name
    location = azurerm_resource_group.icebox_rg.location
    os_type = "Linux"
    sku_name = "F1"
}

resource "azurerm_linux_web_app" "icebox_api" {
    name = "icebox-companion-api"
    resource_group_name = azurerm_resource_group.icebox_rg.name
    location = azurerm_service_plan.icebox_plan.location
    service_plan_id = azurerm_service_plan.icebox_plan.id

    site_config {
        always_on = false
        application_stack{
            dotnet_version = "8.0"
        }
        
    }

}