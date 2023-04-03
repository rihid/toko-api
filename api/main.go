package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type Costumer struct {
	gorm.Model
	CostumerName string `json:"costumer_name"`
	Phone_Number string `json:"phone_number"`
	Address      string `json:"address"`
}

type Product struct {
	gorm.Model
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Color       string   `json:"color"`
	Price       int      `json:"price"`
//	CostumerID  int      `json:"costumer_id"`
//	Costumer    Costumer `json:"costumer"`
}

type Transaksion struct {
	gorm.Model
	ProductID  int      `json:"product_id"`
	CostumerID int      `json:"costumer_id"`
	Total      int      `json:"total"`
	Costumer   Costumer `gorm:"foreignKey:CostumerID"`
	Product    Product  `gorm:"foreignKey:ProductID"`
}

var DB *gorm.DB

func init() {
	dsn := "host=localhost user=postgres password=postgres dbname=toko port=5432 sslmode=disable TimeZone=Asia/jakarta"
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err.Error())
	}
}

var middleware func(c *fiber.Ctx) error

func main() {
	DB.AutoMigrate(&Costumer{}, &Product{}, &Transaksion{})

	app := fiber.New()
	app.Use(cors.New())
	app.Use(func(c *fiber.Ctx) error {
		fmt.Println("uy")
		return c.Next()
	})

	// middleware = func(c *fiber.Ctx) error {
	// 	fmt.Println("ass")
	// 	return c.JSON(1)
	// }
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello world 2!")
	})

	app.Post("/product", func(c *fiber.Ctx) error {
		item := Product{}
		err := c.BodyParser(&item)
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
		}

		DB.Create(&item)

		return c.JSON(fiber.Map{
			"success": true,
			"message": "",
			"data":    item,
		})
	})

	app.Post("/costumer", func(c *fiber.Ctx) error {
		item := Costumer{}
		err := c.BodyParser(&item)
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
		}

		DB.Create(&item)
		DB.Preload("product").Find(&item)
		return c.JSON(fiber.Map{
			"success": true,
			"message": "",
			"data":    item,
		})
	})

	app.Post("/transaksion", func(c *fiber.Ctx) error {
		item := Transaksion{}
		err := c.BodyParser(&item)
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
		}

		DB.Create(&item)

		return c.JSON(fiber.Map{
			"success": true,
			"message": "",
			"data":    item,
		})
	})

	app.Get("/product", func(c *fiber.Ctx) error {
		name := c.Query("name")
		items := []Product{}

		if name != "" {
			DB.Where("name LIKE ?", fmt.Sprintf("%%%s%%", name)).Find(&items)
			if len(items) > 0 {
				return c.JSON(fiber.Map{
					"success": true,
					"message": "",
					"data":    items,
				})
			}

			return c.JSON(fiber.Map{
				"success": true,
				"message": fmt.Sprintf("Items with name %s not found", name),
				"data":    items,
			})
		}

		DB.Find(&items)

		return c.JSON(fiber.Map{
			"success": true,
			"message": "",
			"data":    items,
		})
	})

	app.Get("/costumer", func(c *fiber.Ctx) error {
		//name := c.Query("name")
		items := []Costumer{}

		// if name != "" {
		// 	DB.Where("name LIKE ?", fmt.Sprintf("%%%s%%", name)).Find(&items)
		// 	if len(items) > 0 {
		// 		return c.JSON(fiber.Map{
		// 			"success": true,
		// 			"message": "",
		// 			"data":    items,
		// 		})
		// 	}

		// 	return c.JSON(fiber.Map{
		// 		"success": true,
		// 		"message": fmt.Sprintf("Items with name %s not found", name),
		// 		"data":    items,
		// 	})
		// }

		//DB.Find(&items)
		DB.Preload("product").Find(&items)

		return c.JSON(fiber.Map{
			"success": true,
			"message": "",
			"data":    items,
		})
	})

	app.Get("/transaksion", func(c *fiber.Ctx) error {
		name := c.Query("name")
		items := []Transaksion{}

		if name != "" {
			DB.Where("name LIKE ?", fmt.Sprintf("%%%s%%", name)).Find(&items)
			if len(items) > 0 {
				return c.JSON(fiber.Map{
					"success": true,
					"message": "",
					"data":    items,
				})
			}

			return c.JSON(fiber.Map{
				"success": true,
				"message": fmt.Sprintf("Items with name %s not found", name),
				"data":    items,
			})
		}

		DB.Preload("Product").Preload(("Costumer")).Find(&items)

		return c.JSON(fiber.Map{
			"success": true,
			"message": "",
			"data":    items,
		})
	})

	app.Get("/product/:id", func(c *fiber.Ctx) error {
		item := Product{}
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
		}

		result := DB.First(&item, id)
		if result.RowsAffected != 0 {
			return c.JSON(fiber.Map{
				"success": true,
				"message": "",
				"data":    item,
			})
		}

		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": fmt.Sprintf("Item with ID %d not found", id),
			"data":    nil,
		})
	})

	app.Get("/costumer/:id", func(c *fiber.Ctx) error {
		item := Costumer{}
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
		}

		result := DB.First(&item, id)
		if result.RowsAffected != 0 {
			return c.JSON(fiber.Map{
				"success": true,
				"message": "",
				"data":    item,
			})
		}

		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": fmt.Sprintf("Item with ID %d not found", id),
			"data":    nil,
		})
	})

	type TransaksionResponse struct {
		CustomerName string
		ProductName  string
		ProductDesc  string
	}
	app.Get("/reports/product", func(c *fiber.Ctx) error {

		rows, err := DB.Raw("select c.costumer_name, p.name, p.description from transaksions t left join products p on p.id=t.product_id left join costumers c on c.id = t.costumer_id;").Rows()
		defer rows.Close()
		if err != nil {

		}
		var item TransaksionResponse
		var items []TransaksionResponse
		for rows.Next() {
			rows.Scan(&item.CustomerName, &item.ProductName, &item.ProductDesc)
			items = append(items, item)
			// do something
		}

		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"success": true,
			"message": "",
			"data":    items,
		})
	})

	app.Put("/product/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
		}

		item := Product{}
		err = c.BodyParser(&item)
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
		}

		item.ID = uint(id)

		if item.Name == "" {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Name is required",
				"data":    nil,
			})
		}

		result := DB.Save(&item)
		if result.RowsAffected != 0 {
			return c.JSON(fiber.Map{
				"success": true,
				"message": "",
				"data":    item,
			})
		}

		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": fmt.Sprintf("Item with ID %d not found", id),
			"data":    nil,
		})
	})

	app.Put("/costumer/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
		}

		item := Costumer{}
		err = c.BodyParser(&item)
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
		}

		item.ID = uint(id)

		if item.CostumerName == "" {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": "Name is required",
				"data":    nil,
			})
		}

		result := DB.Save(&item)
		if result.RowsAffected != 0 {
			return c.JSON(fiber.Map{
				"success": true,
				"message": "",
				"data":    item,
			})
		}

		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": fmt.Sprintf("Item with ID %d not found", id),
			"data":    nil,
		})
	})

	app.Delete("/product/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
		}

		result := DB.Delete(&Product{}, id)
		if result.RowsAffected != 0 {
			return c.JSON(fiber.Map{
				"success": true,
				"message": "",
				"data":    nil,
			})
		}

		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": fmt.Sprintf("Item with ID %d not found", id),
			"data":    nil,
		})
	})

	app.Delete("/costumer/:id", func(c *fiber.Ctx) error {
		id, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
		}

		result := DB.Delete(&Costumer{}, id)
		if result.RowsAffected != 0 {
			return c.JSON(fiber.Map{
				"success": true,
				"message": "",
				"data":    nil,
			})
		}

		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": fmt.Sprintf("Item with ID %d not found", id),
			"data":    nil,
		})
	})

	app.Listen(":8080")
}
