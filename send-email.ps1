# Script para enviar invitación MIPIM a Alberto Balderas
$headers = @{
    'Content-Type' = 'application/json'
    'Authorization' = 'Bearer mipim_secret_key_2025_growthbdm'
}

$body = @{
    subject = 'Invitación Exclusiva - MIPIM 2026 México'
    recipients = @(
        @{
            email = 'alberto.balderas@growthbdm.com'
            name = 'Alberto Balderas'
            company = 'ABDev'
            position = 'DEv'
            magicLinkUrl = 'https://aliest.growthbdm.com/ticket/YWxiZXJ0by5iYWxkZXJhc0Bncm93dGhiZG0uY29tOm1pcGltLTIwMjYtbWV4aWNvOjE3NTcxMjU2MDA'
        }
    )
    eventDate = '10 de septiembre, 2025'
    eventLocation = 'Neuchatel, Ciudad de México'
    customMessage = 'Como líder en el sector inmobiliario, tu participación en MIPIM 2026 México será fundamental. Este evento reunirá a los principales actores del mercado inmobiliario internacional. ¡Esperamos contar con tu presencia!'
} | ConvertTo-Json -Depth 3

try {
    Write-Host "Enviando invitación MIPIM a Alberto Balderas..." -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri 'https://aliest.growthbdm.com/api/send-mipim-invitations' -Method POST -Headers $headers -Body $body
    
    Write-Host "✅ Invitación enviada exitosamente:" -ForegroundColor Green
    Write-Host "- Destinatario: alberto.balderas@growthbdm.com" -ForegroundColor White
    Write-Host "- Nombre: Alberto Balderas" -ForegroundColor White
    Write-Host "- Empresa: ABDev" -ForegroundColor White
    Write-Host "- Cargo: DEv" -ForegroundColor White
    Write-Host "- Campaign ID: $($response.campaignId)" -ForegroundColor White
    Write-Host "- Emails enviados: $($response.emailsSent)" -ForegroundColor White
    Write-Host "- Message ID: $($response.results[0].messageId)" -ForegroundColor White
    Write-Host ""
    Write-Host "📧 Detalles del correo:" -ForegroundColor Cyan
    Write-Host "- Asunto: Invitación Exclusiva - MIPIM 2026 México" -ForegroundColor White
    Write-Host "- Evento: MIPIM 2026 México" -ForegroundColor White
    Write-Host "- Fecha: 10 de septiembre, 2025" -ForegroundColor White
    Write-Host "- Ubicación: Neuchatel, Ciudad de México" -ForegroundColor White
    Write-Host ""
    Write-Host "🔗 Magic Link: https://aliest.growthbdm.com/ticket/YWxiZXJ0by5iYWxkZXJhc0Bncm93dGhiZG0uY29tOm1pcGltLTIwMjYtbWV4aWNvOjE3NTcxMjU2MDA" -ForegroundColor Blue
    
} catch {
    Write-Host "❌ Error al enviar invitación:" -ForegroundColor Red
    Write-Host "- Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "- Detalles: $($_.ErrorDetails.Message)" -ForegroundColor Red
}