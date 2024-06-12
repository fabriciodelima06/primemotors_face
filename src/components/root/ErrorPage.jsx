export default ({ statusCode }) => {

   return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
         <h1>{statusCode ? `Erro ${statusCode}` : 'Erro Desconhecido'}</h1>
         <p>
            {statusCode
               ? `Ocorreu um erro no servidor (status code: ${statusCode}).`
               : 'Ocorreu um erro no lado do cliente.'}
         </p>
         <a href="/" style={{ textDecoration: 'underline', color: 'blue' }}>
            Voltar para a página inicial
         </a>
      </div>
   )
}