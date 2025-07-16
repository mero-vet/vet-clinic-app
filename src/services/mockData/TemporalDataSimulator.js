import { addDays, addHours, addMinutes, subDays, subHours } from 'date-fns';

class TemporalDataSimulator {
  constructor() {
    this.dataGenerators = new Map();
    this.patterns = {
      LINEAR: 'linear',
      EXPONENTIAL: 'exponential',
      LOGARITHMIC: 'logarithmic',
      SINUSOIDAL: 'sinusoidal',
      RANDOM_WALK: 'random_walk',
      STEP: 'step',
      SEASONAL: 'seasonal',
    };
  }

  generateTimeSeries(config) {
    const {
      startDate = subDays(new Date(), 30),
      endDate = new Date(),
      interval = 'day',
      pattern = this.patterns.LINEAR,
      baseValue = 100,
      variance = 0.1,
      trend = 0,
      seasonality = null,
      customGenerator = null,
    } = config;

    const series = [];
    let currentDate = new Date(startDate);
    let currentValue = baseValue;
    let index = 0;

    while (currentDate <= endDate) {
      let value;

      if (customGenerator) {
        value = customGenerator(currentValue, index, currentDate);
      } else {
        value = this.applyPattern(
          pattern,
          currentValue,
          index,
          baseValue,
          trend,
          variance
        );
      }

      if (seasonality) {
        value = this.applySeasonality(value, currentDate, seasonality);
      }

      series.push({
        timestamp: currentDate.toISOString(),
        value: Math.max(0, value),
        index,
      });

      currentDate = this.incrementDate(currentDate, interval);
      currentValue = value;
      index++;
    }

    return series;
  }

  applyPattern(pattern, currentValue, index, baseValue, trend, variance) {
    const random = () => (Math.random() - 0.5) * 2 * variance;
    const trendFactor = 1 + (trend * index) / 100;

    switch (pattern) {
      case this.patterns.LINEAR:
        return baseValue * trendFactor + currentValue * random();

      case this.patterns.EXPONENTIAL:
        return baseValue * Math.pow(trendFactor, index / 10) + currentValue * random();

      case this.patterns.LOGARITHMIC:
        return baseValue * Math.log(index + 1) * trendFactor + currentValue * random();

      case this.patterns.SINUSOIDAL:
        return baseValue * (1 + Math.sin(index / 5) * 0.3) * trendFactor + currentValue * random();

      case this.patterns.RANDOM_WALK:
        return currentValue + (currentValue * random() * 0.1) + (trend / 100);

      case this.patterns.STEP:
        const stepSize = Math.floor(index / 10);
        return baseValue * (1 + stepSize * 0.1) * trendFactor + currentValue * random() * 0.5;

      default:
        return currentValue;
    }
  }

  applySeasonality(value, date, seasonality) {
    const {
      type = 'daily',
      amplitude = 0.2,
      phase = 0,
    } = seasonality;

    let seasonalFactor = 0;
    const hour = date.getHours();
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    const month = date.getMonth();

    switch (type) {
      case 'hourly':
        seasonalFactor = Math.sin((hour + phase) * Math.PI / 12) * amplitude;
        break;

      case 'daily':
        seasonalFactor = Math.sin((hour + phase) * Math.PI / 12) * amplitude;
        break;

      case 'weekly':
        seasonalFactor = Math.sin((dayOfWeek + phase) * Math.PI / 3.5) * amplitude;
        break;

      case 'monthly':
        seasonalFactor = Math.sin((dayOfMonth + phase) * Math.PI / 15) * amplitude;
        break;

      case 'yearly':
        seasonalFactor = Math.sin((month + phase) * Math.PI / 6) * amplitude;
        break;
    }

    return value * (1 + seasonalFactor);
  }

  incrementDate(date, interval) {
    switch (interval) {
      case 'minute':
        return addMinutes(date, 1);
      case 'hour':
        return addHours(date, 1);
      case 'day':
        return addDays(date, 1);
      case 'week':
        return addDays(date, 7);
      case 'month':
        return addDays(date, 30);
      default:
        return addDays(date, 1);
    }
  }

  generateEvent(config) {
    const {
      probability = 0.1,
      minInterval = 1,
      maxInterval = 10,
      duration = 1,
      impact = 0.5,
      type = 'spike',
    } = config;

    return {
      shouldOccur: Math.random() < probability,
      interval: Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval,
      duration,
      impact,
      type,
    };
  }

  interpolateData(series, targetInterval) {
    const interpolated = [];
    
    for (let i = 0; i < series.length - 1; i++) {
      const current = series[i];
      const next = series[i + 1];
      
      interpolated.push(current);
      
      const currentTime = new Date(current.timestamp).getTime();
      const nextTime = new Date(next.timestamp).getTime();
      const timeDiff = nextTime - currentTime;
      const steps = Math.floor(timeDiff / targetInterval);
      
      for (let j = 1; j < steps; j++) {
        const ratio = j / steps;
        const interpolatedValue = current.value + (next.value - current.value) * ratio;
        const interpolatedTime = new Date(currentTime + targetInterval * j);
        
        interpolated.push({
          timestamp: interpolatedTime.toISOString(),
          value: interpolatedValue,
          interpolated: true,
        });
      }
    }
    
    if (series.length > 0) {
      interpolated.push(series[series.length - 1]);
    }
    
    return interpolated;
  }

  aggregateData(series, aggregationType = 'average', interval = 'day') {
    const buckets = new Map();
    
    series.forEach(point => {
      const bucketKey = this.getBucketKey(new Date(point.timestamp), interval);
      
      if (!buckets.has(bucketKey)) {
        buckets.set(bucketKey, []);
      }
      
      buckets.get(bucketKey).push(point.value);
    });
    
    const aggregated = [];
    
    buckets.forEach((values, key) => {
      let aggregatedValue;
      
      switch (aggregationType) {
        case 'sum':
          aggregatedValue = values.reduce((sum, val) => sum + val, 0);
          break;
        case 'average':
          aggregatedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
          break;
        case 'max':
          aggregatedValue = Math.max(...values);
          break;
        case 'min':
          aggregatedValue = Math.min(...values);
          break;
        case 'count':
          aggregatedValue = values.length;
          break;
        default:
          aggregatedValue = values[0];
      }
      
      aggregated.push({
        timestamp: key,
        value: aggregatedValue,
        count: values.length,
      });
    });
    
    return aggregated.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  getBucketKey(date, interval) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    
    switch (interval) {
      case 'hour':
        return new Date(year, month, day, hour).toISOString();
      case 'day':
        return new Date(year, month, day).toISOString();
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate()).toISOString();
      case 'month':
        return new Date(year, month).toISOString();
      case 'year':
        return new Date(year, 0).toISOString();
      default:
        return new Date(year, month, day).toISOString();
    }
  }

  addNoise(series, noiseLevel = 0.1) {
    return series.map(point => ({
      ...point,
      value: point.value * (1 + (Math.random() - 0.5) * 2 * noiseLevel),
    }));
  }

  smooth(series, windowSize = 3) {
    const smoothed = [];
    
    for (let i = 0; i < series.length; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2));
      const end = Math.min(series.length, i + Math.floor(windowSize / 2) + 1);
      const window = series.slice(start, end);
      const average = window.reduce((sum, point) => sum + point.value, 0) / window.length;
      
      smoothed.push({
        ...series[i],
        value: average,
        smoothed: true,
      });
    }
    
    return smoothed;
  }
}

export default TemporalDataSimulator;