package com.example.todolist.controller;

import com.example.todolist.model.Api;
import com.example.todolist.model.Todo;
import com.example.todolist.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("api/v1/todo")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TodoController {

    private final TodoRepository todoRepository;
    @GetMapping
    public ResponseEntity getTodos(){

        return ResponseEntity.status(200).body(todoRepository.findAll());
    }

    @PostMapping
    public ResponseEntity addTodo(@RequestBody Todo todo){
        if(todo.getMessage().equals("Wake up")){
            return ResponseEntity.status(400).body(new Api("Try another todo",400));
        }
        todoRepository.save(todo);
        return ResponseEntity.status(201).body(new Api("New todo added !",201));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteTodo(@PathVariable Integer id){
        todoRepository.deleteById(id);
        return ResponseEntity.status(200).body(new Api("Todo deleted",200));
    }
    @PutMapping("/{id}")
    public ResponseEntity updateTodo(@PathVariable Integer id,@RequestBody Todo todo){
        Todo oldTodo= todoRepository.findById(id).get();
        oldTodo.setMessage(todo.getMessage());
        todoRepository.save(oldTodo);
        return ResponseEntity.status(200).body(new Api("Todo Updated",200));
    }
}
