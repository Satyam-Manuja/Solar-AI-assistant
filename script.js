        let selectedFile = null;
        let analysisData = null;
        let financialChart = null;

        // File handling
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const previewSection = document.getElementById('previewSection');
        const imagePreview = document.getElementById('imagePreview');

        // Drop zone events
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleDrop);

        fileInput.addEventListener('change', handleFileSelect);

        function handleDragOver(e) {
            e.preventDefault();
            dropZone.classList.add('dragover');
        }

        function handleDragLeave(e) {
            e.preventDefault();
            dropZone.classList.remove('dragover');
        }

        function handleDrop(e) {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        }

        function handleFileSelect(e) {
            const file = e.target.files[0];
            if (file) {
                handleFile(file);
            }
        }

        function handleFile(file) {
            if (!file.type.startsWith('image/')) {
                showError('Please select a valid image file (JPG, PNG, WebP)');
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                showError('File size must be less than 10MB');
                return;
            }

            selectedFile = file;
            
            // Show preview
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                previewSection.style.display = 'block';
                analyzeBtn.disabled = false;
            };
            reader.readAsDataURL(file);

            showSuccess('Image loaded successfully. Click "Analyze Solar Potential" to continue.');
        }

        async function analyzeImage() {
            if (!selectedFile) {
                showError('Please select an image first');
                return;
            }

            // Show loading
            document.getElementById('loading').style.display = 'block';
            document.getElementById('resultsSection').style.display = 'none';
            analyzeBtn.disabled = true;

            try {
                // Simulate AI analysis with realistic data
                await simulateAnalysis();
                
                // Display results
                displayResults();
                document.getElementById('resultsSection').style.display = 'block';
                
            } catch (error) {
                showError('Analysis failed: ' + error.message);
            } finally {
                document.getElementById('loading').style.display = 'none';
                analyzeBtn.disabled = false;
            }
        }

        async function simulateAnalysis() {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate realistic analysis data
            const roofArea = 800 + Math.random() * 1200; // 800-2000 sq ft
            const usablePercentage = 0.6 + Math.random() * 0.3; // 60-90%
            const usableArea = roofArea * usablePercentage;
            const systemSize = usableArea / 100; // ~100 sq ft per kW
            const annualGeneration = systemSize * 1200; // ~1200 kWh per kW per year
            const costPerWatt = 2.5 + Math.random() * 1.5; // $2.50-$4.00 per watt
            const installationCost = systemSize * 1000 * costPerWatt;
            const electricityRate = 0.12 + Math.random() * 0.08; // $0.12-$0.20 per kWh
            const annualSavings = annualGeneration * electricityRate;
            const paybackYears = installationCost / annualSavings;

            analysisData = {
                rooftop: {
                    usableArea: Math.round(usableArea),
                    condition: ['Excellent', 'Good', 'Fair'][Math.floor(Math.random() * 3)],
                    optimalTilt: Math.round(25 + Math.random() * 15),
                    shadingLevel: ['Minimal', 'Low', 'Moderate'][Math.floor(Math.random() * 3)]
                },
                solar: {
                    systemSize: Math.round(systemSize * 10) / 10,
                    annualGeneration: Math.round(annualGeneration),
                    efficiency: Math.round(18 + Math.random() * 4),
                    co2Offset: Math.round(annualGeneration * 0.0004 * 10) / 10
                },
                financial: {
                    installationCost: Math.round(installationCost),
                    annualSavings: Math.round(annualSavings),
                    paybackPeriod: Math.round(paybackYears * 10) / 10,
                    roi25Year: Math.round(((annualSavings * 25 - installationCost) / installationCost) * 100)
                },
                recommendations: generateRecommendations()
            };
        }

        function generateRecommendations() {
            const recommendations = [
                "Consider high-efficiency monocrystalline panels for maximum power output in limited space",
                "Install micro-inverters for better performance monitoring and system optimization",
                "Ensure proper roof ventilation to maintain panel efficiency in hot weather",
                "Schedule professional cleaning quarterly to maintain optimal performance",
                "Consider battery storage system for energy independence and backup power"
            ];

            return recommendations.slice(0, 3 + Math.floor(Math.random() * 3));
        }

        function displayResults() {
            // Update rooftop analysis
            document.getElementById('usableArea').textContent = `${analysisData.rooftop.usableArea} sq ft`;
            document.getElementById('roofCondition').textContent = analysisData.rooftop.condition;
            document.getElementById('optimalTilt').textContent = `${analysisData.rooftop.optimalTilt}°`;
            document.getElementById('shadingLevel').textContent = analysisData.rooftop.shadingLevel;

            // Update solar potential
            document.getElementById('systemSize').textContent = `${analysisData.solar.systemSize} kW`;
            document.getElementById('annualGeneration').textContent = `${analysisData.solar.annualGeneration.toLocaleString()} kWh`;
            document.getElementById('efficiencyRating').textContent = `${analysisData.solar.efficiency}%`;
            document.getElementById('co2Offset').textContent = `${analysisData.solar.co2Offset} tons/year`;

            // Update financial analysis
            document.getElementById('installationCost').textContent = `$${analysisData.financial.installationCost.toLocaleString()}`;
            document.getElementById('annualSavings').textContent = `$${analysisData.financial.annualSavings.toLocaleString()}`;
            document.getElementById('paybackPeriod').textContent = `${analysisData.financial.paybackPeriod} years`;
            document.getElementById('roi25Year').textContent = `${analysisData.financial.roi25Year}%`;

            // Update recommendations
            const recommendationsList = document.getElementById('recommendationsList');
            recommendationsList.innerHTML = '';
            analysisData.recommendations.forEach(rec => {
                const item = document.createElement('div');
                item.className = 'recommendation-item';
                item.textContent = rec;
                recommendationsList.appendChild(item);
            });

            // Create financial chart
            createFinancialChart();
        }

        function createFinancialChart() {
            // Destroy existing chart if it exists
            if (financialChart) {
                financialChart.destroy();
            }
            
            const ctx = document.getElementById('financialChart').getContext('2d');
            
            // Generate 25-year financial data
            const years = [];
            const cumulativeSavings = [];
            const netBenefit = [];
            
            let cumulative = -analysisData.financial.installationCost;
            
            for (let i = 1; i <= 25; i++) {
                years.push(i);
                cumulative += analysisData.financial.annualSavings;
                cumulativeSavings.push(Math.round(cumulative));
                netBenefit.push(Math.round(cumulative + analysisData.financial.installationCost));
            }

            financialChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: years,
                    datasets: [{
                        label: 'Net Benefit',
                        data: cumulativeSavings,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Break-even Line',
                        data: new Array(25).fill(0),
                        borderColor: '#ef4444',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Cumulative Financial Benefits Over 25 Years'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Years'
                            }
                        }
                    }
                }
            });
        }

        function showError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.textContent = message;
            document.querySelector('.upload-section').appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 5000);
        }

        function showSuccess(message) {
            const successDiv = document.createElement('div');
            successDiv.className = 'success';
            successDiv.textContent = message;
            document.querySelector('.upload-section').appendChild(successDiv);
            setTimeout(() => successDiv.remove(), 5000);
        }