from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mysql.connector
from passlib.hash import bcrypt

app = FastAPI()

# Database connection configuration
db_config = {
    'host': '127.0.0.1',
    'user': 'wads',
    'password': 'database',
    'database': 'todos',
}

# Establish database connection
db_connection = mysql.connector.connect(**db_config)
db_cursor = db_connection.cursor()

# Data model for ToDo items
class TodoItem(BaseModel):
    id: int
    title: str
    isCompleted: bool

# Create ToDo item endpoint
@app.post("/todo/")
def create_todo_item(todo: TodoItem):
    # Insert new ToDo item into the database
    sql_insert_todo = "INSERT INTO todoitem (title, isCompleted) VALUES (%s, %s)"
    db_cursor.execute(sql_insert_todo, (todo.title, todo.isCompleted))
    db_connection.commit()
    return {"message": "Todo item created successfully"}

# Read all ToDo items endpoint
@app.get("/todo/")
def read_todo_items():
    # Retrieve all ToDo items from the database
    sql_read_todo = "SELECT id, title, isCompleted FROM todoitem"
    db_cursor.execute(sql_read_todo)
    todo_items = db_cursor.fetchall()
    return todo_items

# Update ToDo item endpoint
@app.put("/todo/{todo_id}")
def update_todo_item(todo_id: int, todo: TodoItem):
    # Update the specified ToDo item in the database
    sql_update_todo = "UPDATE todoitem SET title = %s, isCompleted = %s WHERE id = %s"
    db_cursor.execute(sql_update_todo, (todo.title, todo.isCompleted, todo_id))
    db_connection.commit()
    return {"message": "Todo item updated successfully"}

# Delete ToDo item endpoint
@app.delete("/todo/{todo_id}")
def delete_todo_item(todo_id: int):
    # Delete the specified ToDo item from the database
    sql_delete_todo = "DELETE FROM todoitem WHERE id = %s"
    db_cursor.execute(sql_delete_todo, (todo_id,))
    db_connection.commit()
    return {"message": "Todo item deleted successfully"}

# Close database connection
@app.on_event("shutdown")
def shutdown_event():
    db_cursor.close()
    db_connection.close()
