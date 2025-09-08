# Script PowerShell para enviar invitación MIPIM a Alberto Balderas

$emailData = @{
    subject = "🏢 Invitación Exclusiva MIPIM 2026 - Cannes, Francia"
    recipients = @(
        @{
            email = "abalderas10@gmail.com"
            name = "Alberto Balderas"
            company = "ABDev"
            position = "Dev"
        }
    )
    eventDate = "11-14 Marzo 2026"
    eventLocation = "Palais des Festivals, Cannes, Francia"
    customMessage = "Te invitamos a participar en el evento inmobiliario más importante del mundo. Esta es una oportunidad única para conectar con líderes globales del sector."
}

$jsonBody = $emailData | ConvertTo-Json -Depth 3

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer your-secret-key"
}

Write-Host "🚀 Enviando invitación MIPIM a Alberto Balderas..." -ForegroundColor Green
Write-Host "📧 Email: abalderas10@gmail.com" -ForegroundColor Cyan
Write-Host "👤 Nombre: Alberto Balderas" -ForegroundColor Cyan
Write-Host "🏢 Empresa: ABDev" -ForegroundColor Cyan
Write-Host "💼 Cargo: Dev" -ForegroundColor Cyan
Write-Host "📅 Evento: 11-14 Marzo 2026" -ForegroundColor Cyan
Write-Host "📍 Ubicación: Palais des Festivals, Cannes, Francia" -ForegroundColor Cyan
Write-Host ("="*50) -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "https://aliest.growthbdm.com/api/send-mipim-invitations" `
                                  -Method POST `
                                  -Headers $headers `
                                  -Body $jsonBody `
                                  -ContentType "application/json"
    
    Write-Host "\n✅ ¡Invitación enviada exitosamente!" -ForegroundColor Green
    Write-Host "📊 Respuesta del servidor:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor White
    
    if ($response.emailsSent) {
        Write-Host "\n📨 Emails enviados: $($response.emailsSent)" -ForegroundColor Green
    }
    
    if ($response.campaignId) {
        Write-Host "🆔 Campaign ID: $($response.campaignId)" -ForegroundColor Green
    }
    
    if ($response.results) {
        Write-Host "\n📋 Detalles del envío:" -ForegroundColor Yellow
        foreach ($result in $response.results) {
            Write-Host "  📧 Email: $($result.email)" -ForegroundColor White
            Write-Host "  🆔 Message ID: $($result.messageId)" -ForegroundColor White
            Write-Host "  📊 Estado: $($result.status)" -ForegroundColor White
            Write-Host ""
        }
    }
    
} catch {
    Write-Host "\n❌ Error al enviar la invitación:" -ForegroundColor Red
    Write-Host "🔍 Código de estado: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "📄 Mensaje de error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "📋 Detalles del error: $errorBody" -ForegroundColor Red
        } catch {
            Write-Host "No se pudo leer el cuerpo del error" -ForegroundColor Red
        }
    }
}

Write-Host "\n✨ Proceso completado." -ForegroundColor Magenta