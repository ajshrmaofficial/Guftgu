import './css/App.css'

const App = () => {

  const sendMessage = (e) => {
    e.preventDefault();
  }

  return (
    <div>
      <h1>MessageMe</h1>
      <form onSubmit={sendMessage}>
        <input type="text" placeholder='Type Message' />
        <button type='submit'>Send</button>
      </form>
    </div>
  )
}

export default App