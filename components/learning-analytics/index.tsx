'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/hooks/use-i18n';
import { LearningAnalyticsData } from '@/app/api/learning-analytics/route';
import { ActivityHeatmap } from './activity-heatmap';
import { TopicPerformanceChart } from './topic-performance-chart';

interface LearningAnalyticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LearningAnalyticsDialog({ open, onOpenChange }: LearningAnalyticsDialogProps) {
  const { t } = useI18n();
  const [data, setData] = useState<LearningAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetch('/api/learning-analytics')
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch learning analytics data:', error);
          setLoading(false);
        });
    }
  }, [open]);

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] h-[85vh]">
          <DialogHeader>
            <DialogTitle>{t('learningAnalytics.title')}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] h-[85vh]">
        <DialogHeader className="flex flex-row items-center justify-between mt-[15px]">
          <div>
            <DialogTitle>{t('learningAnalytics.title')}</DialogTitle>
            <p className="text-sm text-muted-foreground">{t('learningAnalytics.subtitle')}</p>
          </div>
          <Button variant="default" className="bg-purple-600 hover:bg-purple-700" onClick={() => onOpenChange(false)}>
            {t('learningAnalytics.continueLearning')}
          </Button>
        </DialogHeader>
        <div className="flex-1 space-y-3 px-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-4 border rounded-lg">
                <p className="text-xs text-muted-foreground">{t('learningAnalytics.studyTime')}</p>
                <p className="text-2xl font-bold">{data?.studyTime || 0}m</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-xs text-muted-foreground">{t('learningAnalytics.sessions')}</p>
                <p className="text-2xl font-bold">{data?.sessions || 0}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-xs text-muted-foreground">{t('learningAnalytics.completed')}</p>
                <p className="text-2xl font-bold">{data?.completed.current || 0}/{data?.completed.total || 0}</p>
                <p className="text-xs text-muted-foreground">{data?.completed.percentage || 0}%</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-xs text-muted-foreground">{t('learningAnalytics.avgScore')}</p>
                <p className="text-2xl font-bold">{data?.avgScore || 0.0}%</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-xs text-muted-foreground">{t('learningAnalytics.streak')}</p>
                <p className="text-2xl font-bold">{data?.streak || 0} {t('learningAnalytics.days')}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-xs text-muted-foreground">{t('learningAnalytics.progress')}</p>
                <p className="text-2xl font-bold">{data?.progress || 0}%</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-purple-600 h-1.5 rounded-full"
                    style={{ width: `${data?.progress || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">{t('learningAnalytics.learningActivity')}</h3>
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  {data?.learningActivity.hasData ? (
                    <div className="w-full">
                      <ActivityHeatmap data={data?.learningActivity.data || []} />
                    </div>
                  ) : (
                    <p className="text-center">{t('learningAnalytics.noActivityData')}</p>
                  )}
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-4">{t('learningAnalytics.topicPerformance')}</h3>
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  {data?.topicPerformance.hasData ? (
                    <div className="w-full">
                      <TopicPerformanceChart topics={data?.topicPerformance.topics || []} scores={data?.topicPerformance.scores || []} />
                    </div>
                  ) : (
                   <p className="text-center">{t('learningAnalytics.noQuizData')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
}