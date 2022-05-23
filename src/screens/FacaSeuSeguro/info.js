import { View } from 'react-native';

import Formulario from './Formulario';

export default function InfoSeguro({ type, topPage, setView, page, setPage }) {
  return (
    <View
      style={{
        flex: 1
      }}
    >
      <Formulario page={page} setPage={setPage} setView={setView} type={type} success={success} error={error} loading={loading} topPage={topPage} />
    </View>
  )
}