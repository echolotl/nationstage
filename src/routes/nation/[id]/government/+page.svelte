<script lang="ts">
    import { getNationData } from "$lib/api/request";
    import { parseNationGovtPercentages } from "$lib/utils/parseNationData";
    import { onMount } from "svelte";
    import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
  import Content from "$lib/components/content.svelte";
    Chart.register(ArcElement, Tooltip, Legend, PieController);

    interface ChartData {
        labels: string[];
        datasets: {
            data: number[];
            backgroundColor: string[];
            borderWidth: number; // Add borderWidth property
        }[];
    }

    let chartData: ChartData = {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
            borderWidth: 0 // Initialize borderWidth
        }]
    };

    let chart: Chart;

    function shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    onMount(async () => {
        const nationData = await getNationData();
        const percentages = parseNationGovtPercentages(nationData);
        
        // Get all theme colors
        const root = document.documentElement;
        const colors = shuffleArray([
            getComputedStyle(root).getPropertyValue('--theme-accent').trim(),
            getComputedStyle(root).getPropertyValue('--green-dark').trim(),
            getComputedStyle(root).getPropertyValue('--purple-darker').trim(),
            getComputedStyle(root).getPropertyValue('--blue-darker').trim(),
            getComputedStyle(root).getPropertyValue('--purple-dark').trim(),
            getComputedStyle(root).getPropertyValue('--blue-light').trim(),
            getComputedStyle(root).getPropertyValue('--yellow-darker').trim(),
            getComputedStyle(root).getPropertyValue('--orange-dark').trim(),
            getComputedStyle(root).getPropertyValue('--yellow-light').trim(),
            getComputedStyle(root).getPropertyValue('--red-darker').trim(),
            getComputedStyle(root).getPropertyValue('--red-dark').trim(),
            getComputedStyle(root).getPropertyValue('--orange-light').trim(),
        ]);

        chartData = {
            labels: Object.keys(percentages),
            datasets: [{
                data: Object.values(percentages),
                backgroundColor: colors,
                borderWidth: 1
            }]
        };

        const ctx = (document.getElementById('govtChart') as HTMLCanvasElement).getContext('2d');
        if (ctx) {
            chart = new Chart(ctx, {
                type: 'pie',
                data: chartData,
                options: {
                    responsive: true,
                    aspectRatio: 1, // Controls the size ratio
                    plugins: {
                        legend: {
                            display: false, // Disable the legend
                        },
                        tooltip: {
                            backgroundColor: '#fff',
                            titleColor: '#333',
                            bodyColor: '#666',
                            borderColor: '#ccc',
                            borderWidth: 1,
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    }
                },
            });
        }
    });
</script>
<Content>
    <div class="bb-box">
    <canvas id="govtChart" class="pie-chart"></canvas></div>
</Content>


<style>
    .pie-chart {
        width: 600px; /* Larger width */
        height: 400px; /* Smaller height for the 1.5 aspect ratio */
        max-width: 90%; /* Increased from 75% */
        margin: auto;
        border-radius: 8px;
    }
</style>