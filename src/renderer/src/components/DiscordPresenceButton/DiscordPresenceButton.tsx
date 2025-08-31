// import React from 'react'

export function DiscordPresenceButton() {
  const handleClick = async () => {
  // @ts-ignore
  const result = await window.electronAPI.setDiscordPresence({
      clientId: '1409736895440621610',
      details: 'Jugando desde React',
      state: '¡Presencia actualizada!',
      largeImageKey: 'nintendo_switch_logo',
      largeImageText: 'Nintendo Switch',
      startTimestamp: Date.now()
    })
    if (result.success) {
      alert('Presence actualizado correctamente')
    } else {
      alert('Error: ' + result.error)
    }
  }

  return (
    <button onClick={handleClick}>
      Actualizar Discord Presence
    </button>
  )
}