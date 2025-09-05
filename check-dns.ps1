# Script para verificar registros DNS del dominio aliest.growthbdm.com

Write-Host "Verificando registros DNS para aliest.growthbdm.com..." -ForegroundColor Green
Write-Host ""

# Verificar registros MX
Write-Host "=== REGISTROS MX ===" -ForegroundColor Yellow
try {
    $mxRecords = Resolve-DnsName -Name "aliest.growthbdm.com" -Type MX -ErrorAction Stop
    $mxRecords | ForEach-Object {
        Write-Host "MX: $($_.NameExchange) (Priority: $($_.Preference))"
    }
} catch {
    Write-Host "Error al obtener registros MX: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Verificar registros SPF
Write-Host "=== REGISTROS SPF ===" -ForegroundColor Yellow
try {
    $txtRecords = Resolve-DnsName -Name "aliest.growthbdm.com" -Type TXT -ErrorAction Stop
    $spfRecords = $txtRecords | Where-Object { $_.Strings -like "*v=spf1*" }
    if ($spfRecords) {
        $spfRecords | ForEach-Object {
            Write-Host "SPF: $($_.Strings)"
        }
    } else {
        Write-Host "No se encontraron registros SPF" -ForegroundColor Red
    }
} catch {
    Write-Host "Error al obtener registros TXT/SPF: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Verificar registros DKIM (selector común: resend)
Write-Host "=== REGISTROS DKIM ===" -ForegroundColor Yellow
$dkimSelectors = @("resend", "default", "mail", "email", "s1", "s2")

foreach ($selector in $dkimSelectors) {
    $dkimDomain = "$selector._domainkey.aliest.growthbdm.com"
    try {
        $dkimRecords = Resolve-DnsName -Name $dkimDomain -Type TXT -ErrorAction Stop
        if ($dkimRecords) {
            Write-Host "DKIM ($selector): $($dkimRecords[0].Strings)"
        }
    } catch {
        # Silenciar errores para selectores que no existen
    }
}

Write-Host ""
Write-Host "Verificación DNS completada." -ForegroundColor Green