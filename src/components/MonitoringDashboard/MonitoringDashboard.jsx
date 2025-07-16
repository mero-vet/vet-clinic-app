import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, LinearProgress, Chip, IconButton, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess, CheckCircle, Warning, Error } from '@mui/icons-material';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';
import './MonitoringDashboard.css';

const MetricCard = ({ title, value, unit, status, trend, description }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return '#4caf50';
      case 'warning': return '#ff9800';
      case 'critical': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'good': return <CheckCircle sx={{ color: getStatusColor() }} />;
      case 'warning': return <Warning sx={{ color: getStatusColor() }} />;
      case 'critical': return <Error sx={{ color: getStatusColor() }} />;
      default: return null;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
        {getStatusIcon()}
      </Box>
      <Typography variant="h4" component="div" gutterBottom>
        {value}
        <Typography variant="caption" component="span" sx={{ ml: 1 }}>
          {unit}
        </Typography>
      </Typography>
      {trend && (
        <Typography variant="caption" color={trend > 0 ? 'error' : 'success'}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </Typography>
      )}
      {description && (
        <Typography variant="caption" display="block" color="textSecondary" mt={1}>
          {description}
        </Typography>
      )}
    </Paper>
  );
};

const MonitoringDashboard = ({ minimal = false }) => {
  const [expanded, setExpanded] = useState(!minimal);
  const [metrics, setMetrics] = useState({
    performance: {
      loadTime: { value: 0, unit: 's', status: 'unknown' },
      fcp: { value: 0, unit: 'ms', status: 'unknown' },
      lcp: { value: 0, unit: 'ms', status: 'unknown' },
      cls: { value: 0, unit: '', status: 'unknown' },
      bundleSize: { value: 0, unit: 'MB', status: 'unknown' }
    },
    testing: {
      coverage: { value: 0, unit: '%', status: 'unknown' },
      testReliability: { value: 0, unit: '%', status: 'unknown' },
      passedTests: { value: 0, unit: '', status: 'unknown' }
    },
    health: {
      errorRate: { value: 0, unit: '%', status: 'unknown' },
      memoryUsage: { value: 0, unit: 'MB', status: 'unknown' },
      consoleErrors: { value: 0, unit: '', status: 'unknown' }
    }
  });

  const performanceMonitor = usePerformanceMonitor();

  useEffect(() => {
    const updateMetrics = () => {
      const perfData = performanceMonitor?.getMetrics() || {};
      
      setMetrics(prev => ({
        ...prev,
        performance: {
          loadTime: {
            value: (perfData.navigationTiming?.loadEventEnd - perfData.navigationTiming?.fetchStart) / 1000 || 0,
            unit: 's',
            status: perfData.loadTime < 3 ? 'good' : perfData.loadTime < 5 ? 'warning' : 'critical'
          },
          fcp: {
            value: Math.round(perfData.webVitals?.FCP || 0),
            unit: 'ms',
            status: perfData.webVitals?.FCP < 1800 ? 'good' : perfData.webVitals?.FCP < 3000 ? 'warning' : 'critical'
          },
          lcp: {
            value: Math.round(perfData.webVitals?.LCP || 0),
            unit: 'ms',
            status: perfData.webVitals?.LCP < 2500 ? 'good' : perfData.webVitals?.LCP < 4000 ? 'warning' : 'critical'
          },
          cls: {
            value: (perfData.webVitals?.CLS || 0).toFixed(3),
            unit: '',
            status: perfData.webVitals?.CLS < 0.1 ? 'good' : perfData.webVitals?.CLS < 0.25 ? 'warning' : 'critical'
          },
          bundleSize: {
            value: (perfData.bundleMetrics?.totalSize / 1024 / 1024 || 0).toFixed(2),
            unit: 'MB',
            status: perfData.bundleMetrics?.totalSize < 2 * 1024 * 1024 ? 'good' : perfData.bundleMetrics?.totalSize < 3 * 1024 * 1024 ? 'warning' : 'critical'
          }
        }
      }));
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, [performanceMonitor]);

  useEffect(() => {
    const checkTestMetrics = async () => {
      try {
        const coverageData = localStorage.getItem('testCoverage');
        if (coverageData) {
          const coverage = JSON.parse(coverageData);
          setMetrics(prev => ({
            ...prev,
            testing: {
              coverage: {
                value: coverage.percentage || 0,
                unit: '%',
                status: coverage.percentage >= 60 ? 'good' : coverage.percentage >= 40 ? 'warning' : 'critical'
              },
              testReliability: {
                value: coverage.reliability || 87,
                unit: '%',
                status: coverage.reliability >= 95 ? 'good' : coverage.reliability >= 85 ? 'warning' : 'critical'
              },
              passedTests: {
                value: coverage.passed || 0,
                unit: '',
                status: coverage.failed === 0 ? 'good' : coverage.failed < 5 ? 'warning' : 'critical'
              }
            }
          }));
        }
      } catch (error) {
        console.error('Error loading test metrics:', error);
      }
    };

    checkTestMetrics();
  }, []);

  if (minimal) {
    return (
      <Box className="monitoring-dashboard-minimal">
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="caption">System Health</Typography>
          <Chip 
            label={`Load: ${metrics.performance.loadTime.value}s`}
            size="small"
            color={metrics.performance.loadTime.status === 'good' ? 'success' : 'warning'}
          />
          <Chip 
            label={`Coverage: ${metrics.testing.coverage.value}%`}
            size="small"
            color={metrics.testing.coverage.status === 'good' ? 'success' : 'warning'}
          />
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Collapse in={expanded}>
          <Box mt={2}>
            <MonitoringDashboard minimal={false} />
          </Box>
        </Collapse>
      </Box>
    );
  }

  return (
    <Box className="monitoring-dashboard" p={3}>
      <Typography variant="h5" gutterBottom>
        System Monitoring Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Performance Metrics
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Page Load Time"
            value={metrics.performance.loadTime.value}
            unit={metrics.performance.loadTime.unit}
            status={metrics.performance.loadTime.status}
            description="Target: < 3s"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="First Contentful Paint"
            value={metrics.performance.fcp.value}
            unit={metrics.performance.fcp.unit}
            status={metrics.performance.fcp.status}
            description="Target: < 1.8s"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Largest Contentful Paint"
            value={metrics.performance.lcp.value}
            unit={metrics.performance.lcp.unit}
            status={metrics.performance.lcp.status}
            description="Target: < 2.5s"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Bundle Size"
            value={metrics.performance.bundleSize.value}
            unit={metrics.performance.bundleSize.unit}
            status={metrics.performance.bundleSize.status}
            description="Target: < 2MB"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Testing Metrics
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Test Coverage"
            value={metrics.testing.coverage.value}
            unit={metrics.testing.coverage.unit}
            status={metrics.testing.coverage.status}
            description="Target: > 60%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Agent Test Reliability"
            value={metrics.testing.testReliability.value}
            unit={metrics.testing.testReliability.unit}
            status={metrics.testing.testReliability.status}
            description="Target: > 95%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Passed Tests"
            value={metrics.testing.passedTests.value}
            unit={metrics.testing.passedTests.unit}
            status={metrics.testing.passedTests.status}
            description="All tests passing"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MonitoringDashboard;