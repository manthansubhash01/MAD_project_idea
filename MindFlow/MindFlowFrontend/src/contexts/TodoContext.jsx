import React,{createContext, useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TodoContext = createContext()

const API_URL = "https://mad-project-idea.onrender.com/user/tasks";
const TOKEN = "authToken";

const TodoProvider = ({children}) => {
    const [todos, setTodos] = useState([])
    const [total, setTotal] = useState(0);

    async function loadTodos(){
        try{
            const token = await AsyncStorage.getItem(TOKEN)

            const data = await fetch(API_URL,{
                headers: { "Authorization": `Bearer ${token}` }
            })
            const result = await data.json()
            setTotal(result.length);
            setTodos(result.filter((ele) => !ele.isCompleted))
            console.log(result)
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        loadTodos()
    },[todos])

    return (
        <TodoContext.Provider value={{todos, setTodos,total, setTotal}}>
            {children}
        </TodoContext.Provider>
    )
}

export {TodoContext,TodoProvider}