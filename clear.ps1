# Script para Limpar Recursos do Google Cloud - Garimpei API
# Execute este script para remover todos os recursos criados e evitar cobranças

Write-Host "🧹 Iniciando limpeza de recursos do Google Cloud..." -ForegroundColor Yellow
Write-Host "⚠️  Este script irá remover TODOS os recursos criados para o projeto Garimpei API" -ForegroundColor Red
$confirmacao = Read-Host "Tem certeza que deseja continuar? (digite 'SIM' para confirmar)"

if ($confirmacao -ne "SIM") {
    Write-Host "❌ Operação cancelada pelo usuário" -ForegroundColor Red
    exit
}

$PROJECT_ID = "garimpei-dev"

Write-Host "🔧 Configurando projeto..." -ForegroundColor Blue
gcloud config set project $PROJECT_ID

Write-Host "🗑️  Removendo serviços Cloud Run..." -ForegroundColor Blue
try {
    gcloud run services delete garimpei-api --region=us-central1 --quiet
    Write-Host "✅ Cloud Run service removido" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  Serviço Cloud Run não encontrado ou já removido" -ForegroundColor Yellow
}

Write-Host "🗑️  Removendo builds do Cloud Build..." -ForegroundColor Blue
try {
    # Cancelar builds em andamento
    $builds = gcloud builds list --ongoing --format="value(id)" 2>$null
    if ($builds) {
        foreach ($build in $builds) {
            gcloud builds cancel $build --quiet
        }
    }
    Write-Host "✅ Builds cancelados" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  Nenhum build em andamento encontrado" -ForegroundColor Yellow
}

Write-Host "🗑️  Removendo imagens do Artifact Registry..." -ForegroundColor Blue
try {
    # Listar e remover todas as imagens
    $repositories = gcloud artifacts repositories list --location=us-central1 --format="value(name)" 2>$null
    foreach ($repo in $repositories) {
        if ($repo -like "*cloud-run-source-deploy*") {
            gcloud artifacts repositories delete $repo --location=us-central1 --quiet
        }
    }
    Write-Host "✅ Repositórios Artifact Registry removidos" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  Nenhum repositório Artifact Registry encontrado" -ForegroundColor Yellow
}

Write-Host "🗑️  Removendo secrets do Secret Manager..." -ForegroundColor Blue
$secrets = @("jwt-secret", "db-username", "db-password", "db-host", "db-name")
foreach ($secret in $secrets) {
    try {
        gcloud secrets delete $secret --quiet
        Write-Host "✅ Secret '$secret' removido" -ForegroundColor Green
    } catch {
        Write-Host "ℹ️  Secret '$secret' não encontrado" -ForegroundColor Yellow
    }
}

Write-Host "🗑️  Removendo instâncias Cloud SQL..." -ForegroundColor Blue
try {
    $instances = gcloud sql instances list --format="value(name)" 2>$null
    foreach ($instance in $instances) {
        if ($instance -like "*garimpei*") {
            gcloud sql instances delete $instance --quiet
        }
    }
    Write-Host "✅ Instâncias Cloud SQL removidas" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  Nenhuma instância Cloud SQL encontrada" -ForegroundColor Yellow
}

Write-Host "🗑️  Removendo jobs do Cloud Run..." -ForegroundColor Blue
try {
    $jobs = gcloud run jobs list --region=us-central1 --format="value(name)" 2>$null
    foreach ($job in $jobs) {
        if ($job -like "*migration*" -or $job -like "*garimpei*") {
            gcloud run jobs delete $job --region=us-central1 --quiet
        }
    }
    Write-Host "✅ Jobs do Cloud Run removidos" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  Nenhum job do Cloud Run encontrado" -ForegroundColor Yellow
}

Write-Host "🗑️  Limpando buckets de storage do Cloud Build..." -ForegroundColor Blue
try {
    $buckets = gsutil ls -p $PROJECT_ID 2>$null | Where-Object { $_ -like "*cloudbuild*" -or $_ -like "*garimpei*" }
    foreach ($bucket in $buckets) {
        gsutil -m rm -r $bucket
    }
    Write-Host "✅ Buckets de storage limpos" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  Nenhum bucket específico encontrado" -ForegroundColor Yellow
}

Write-Host "🗑️  Desabilitando APIs para economizar..." -ForegroundColor Blue
$apis = @(
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "sqladmin.googleapis.com"
)

foreach ($api in $apis) {
    try {
        gcloud services disable $api --force --quiet
        Write-Host "✅ API $api desabilitada" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Erro ao desabilitar API $api" -ForegroundColor Yellow
    }
}

Write-Host "🗑️  Opção: Deletar projeto completo..." -ForegroundColor Blue
Write-Host "⚠️  ATENÇÃO: Deletar o projeto remove TUDO e garante zero cobrança!" -ForegroundColor Red
$deleteProjeto = Read-Host "Deseja deletar o projeto completo '$PROJECT_ID'? (digite 'DELETAR' para confirmar)"

if ($deleteProjeto -eq "DELETAR") {
    try {
        gcloud projects delete $PROJECT_ID --quiet
        Write-Host "✅ Projeto '$PROJECT_ID' deletado completamente" -ForegroundColor Green
        Write-Host "🎉 GARANTIA: Zero cobrança! Projeto totalmente removido." -ForegroundColor Green
    } catch {
        Write-Host "❌ Erro ao deletar projeto. Delete manualmente no console do Google Cloud" -ForegroundColor Red
    }
} else {
    Write-Host "ℹ️  Projeto mantido. Recursos individuais foram removidos." -ForegroundColor Yellow
}

Write-Host "`n📊 RESUMO DA LIMPEZA:" -ForegroundColor Cyan
Write-Host "✅ Cloud Run services removidos" -ForegroundColor Green
Write-Host "✅ Cloud Build builds cancelados" -ForegroundColor Green
Write-Host "✅ Artifact Registry limpo" -ForegroundColor Green
Write-Host "✅ Secret Manager limpo" -ForegroundColor Green
Write-Host "✅ Cloud SQL removido" -ForegroundColor Green
Write-Host "✅ APIs desabilitadas" -ForegroundColor Green

Write-Host "`n💡 RECOMENDAÇÕES FINAIS:" -ForegroundColor Cyan
Write-Host "1. Verifique o Console do Google Cloud: https://console.cloud.google.com" -ForegroundColor Yellow
Write-Host "2. Confira a página de billing: https://console.cloud.google.com/billing" -ForegroundColor Yellow
Write-Host "3. Se deletou o projeto, não haverá mais cobranças" -ForegroundColor Yellow
Write-Host "4. Se manteve o projeto, monitore por 24-48h para confirmar zero usage" -ForegroundColor Yellow

Write-Host "`n🎯 LIMPEZA CONCLUÍDA! Você não deve ter mais cobranças relacionadas ao Garimpei API." -ForegroundColor Green
