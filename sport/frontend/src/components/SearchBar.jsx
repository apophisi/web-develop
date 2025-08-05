import { useState } from 'react'

const SearchBar = ({ onSearch }) => {
    const [inputValue, setInputValue] = useState('')

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSearch(inputValue)
    }

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="搜索活动名称、描述或地点..."
                value={inputValue}
                onChange={handleInputChange}
            />
            <button type="submit">搜索</button>
        </form>
    )
}

export default SearchBar