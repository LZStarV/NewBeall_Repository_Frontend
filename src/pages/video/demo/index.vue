<template>
    <div class="video-demo-page">
        <div class="page-header">
            <h1>视频演示</h1>
            <p>观看系统功能演示视频，快速了解平台操作</p>
        </div>

        <div class="content-area">
            <!-- 特色视频 -->
            <lay-card title="系统介绍" class="featured-video">
                <div class="video-player-container">
                    <div class="video-player">
                        <div class="video-placeholder">
                            <lay-icon type="layui-icon-play" size="64" />
                            <h3>系统功能全面介绍</h3>
                            <p>了解Newbeall设计报价管理平台的核心功能和优势</p>
                            <lay-button type="primary" size="lg" @click="playVideo('system-intro')">
                                <lay-icon type="layui-icon-play" />
                                播放视频
                            </lay-button>
                        </div>
                    </div>
                    <div class="video-info">
                        <h3>平台功能概览</h3>
                        <p>本视频将为您详细介绍Newbeall平台的主要功能模块，包括云空间管理、产品库建设、需求发布、供应链管理、设计报价等核心业务流程。</p>
                        <div class="video-meta">
                            <span><lay-icon type="layui-icon-time" /> 15分钟</span>
                            <span><lay-icon type="layui-icon-rate" /> 4.8分</span>
                            <span><lay-icon type="layui-icon-face-smile" /> 1,234次观看</span>
                        </div>
                    </div>
                </div>
            </lay-card>

            <!-- 视频分类 -->
            <div class="video-categories">
                <lay-row :space="24">
                    <lay-col :md="8" v-for="category in videoCategories" :key="category.id">
                        <lay-card :title="category.name" class="category-card">
                            <div class="category-description">
                                {{ category.description }}
                            </div>
                            <div class="video-list">
                                <div v-for="video in category.videos" :key="video.id" class="video-item"
                                    @click="playVideo(video.id)">
                                    <div class="video-thumbnail">
                                        <lay-icon type="layui-icon-play" />
                                        <span class="duration">{{ video.duration }}</span>
                                    </div>
                                    <div class="video-details">
                                        <h4>{{ video.title }}</h4>
                                        <p>{{ video.description }}</p>
                                        <div class="video-stats">
                                            <span>{{ video.views }}次观看</span>
                                            <span>{{ video.rating }}分</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </lay-card>
                    </lay-col>
                </lay-row>
            </div>

            <!-- 常见问题视频 -->
            <lay-card title="常见问题解答">
                <div class="faq-videos">
                    <lay-row :space="16">
                        <lay-col :md="6" v-for="faq in faqVideos" :key="faq.id">
                            <div class="faq-video-item" @click="playVideo(faq.id)">
                                <div class="faq-icon">
                                    <lay-icon type="layui-icon-help" />
                                </div>
                                <div class="faq-content">
                                    <h4>{{ faq.question }}</h4>
                                    <p>{{ faq.answer }}</p>
                                    <div class="play-button">
                                        <lay-icon type="layui-icon-play" />
                                        <span>{{ faq.duration }}</span>
                                    </div>
                                </div>
                            </div>
                        </lay-col>
                    </lay-row>
                </div>
            </lay-card>

            <!-- 更新日志视频 -->
            <lay-card title="功能更新">
                <div class="update-videos">
                    <div class="timeline">
                        <div v-for="update in updateVideos" :key="update.id" class="timeline-item">
                            <div class="timeline-marker">
                                <lay-icon type="layui-icon-release" />
                            </div>
                            <div class="timeline-content">
                                <div class="update-header">
                                    <h4>{{ update.version }}</h4>
                                    <span class="update-date">{{ update.date }}</span>
                                </div>
                                <div class="update-description">
                                    {{ update.description }}
                                </div>
                                <div class="update-videos-list">
                                    <div v-for="video in update.videos" :key="video.id" class="update-video"
                                        @click="playVideo(video.id)">
                                        <lay-icon type="layui-icon-play" />
                                        <span>{{ video.title }}</span>
                                        <span class="video-duration">{{ video.duration }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </lay-card>
        </div>

        <!-- 视频播放弹窗 -->
        <lay-layer v-model="showVideoModal" title="视频播放" :area="['80%', '70%']" :max-width="1200">
            <div class="video-modal-content">
                <div class="video-player-wrapper">
                    <div class="video-player-placeholder">
                        <lay-icon type="layui-icon-play" size="48" />
                        <p>视频播放器</p>
                        <p class="video-id">视频ID: {{ currentVideoId }}</p>
                    </div>
                </div>
                <div class="video-controls">
                    <lay-button @click="closeVideoModal">关闭</lay-button>
                    <lay-button type="primary" @click="toggleFullscreen">全屏</lay-button>
                </div>
            </div>
        </lay-layer>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const showVideoModal = ref(false);
const currentVideoId = ref('');

const videoCategories = ref([
    {
        id: 1,
        name: '快速入门',
        description: '新用户必看，快速掌握平台基础操作',
        videos: [
            {
                id: 'quick-start-1',
                title: '账号注册与登录',
                description: '如何注册账号并完成首次登录',
                duration: '3:45',
                views: 2156,
                rating: 4.9
            },
            {
                id: 'quick-start-2',
                title: '界面布局介绍',
                description: '熟悉平台界面布局和主要功能区域',
                duration: '5:20',
                views: 1843,
                rating: 4.7
            },
            {
                id: 'quick-start-3',
                title: '基础设置配置',
                description: '完成个人信息和基础系统设置',
                duration: '4:15',
                views: 1654,
                rating: 4.8
            }
        ]
    },
    {
        id: 2,
        name: '核心功能',
        description: '详细了解平台的核心业务功能',
        videos: [
            {
                id: 'core-1',
                title: '创建第一个项目',
                description: '从零开始创建和管理项目',
                duration: '8:30',
                views: 3421,
                rating: 4.9
            },
            {
                id: 'core-2',
                title: '报价管理流程',
                description: '完整的报价创建、编辑和审批流程',
                duration: '12:45',
                views: 2987,
                rating: 4.8
            },
            {
                id: 'core-3',
                title: '客户关系管理',
                description: '有效管理客户信息和沟通记录',
                duration: '9:15',
                views: 2154,
                rating: 4.6
            }
        ]
    },
    {
        id: 3,
        name: '高级功能',
        description: '掌握平台的高级功能和技巧',
        videos: [
            {
                id: 'advanced-1',
                title: '数据分析与报表',
                description: '利用数据分析功能优化业务决策',
                duration: '11:20',
                views: 1876,
                rating: 4.7
            },
            {
                id: 'advanced-2',
                title: '自动化工作流',
                description: '设置自动化流程提高工作效率',
                duration: '13:50',
                views: 1432,
                rating: 4.5
            },
            {
                id: 'advanced-3',
                title: 'API集成指南',
                description: '与第三方系统集成的完整指南',
                duration: '15:30',
                views: 987,
                rating: 4.4
            }
        ]
    }
]);

const faqVideos = ref([
    {
        id: 'faq-1',
        question: '如何重置密码？',
        answer: '详细演示密码重置的完整流程',
        duration: '2:30'
    },
    {
        id: 'faq-2',
        question: '数据如何备份？',
        answer: '了解数据备份和恢复的最佳实践',
        duration: '4:15'
    },
    {
        id: 'faq-3',
        question: '权限设置说明',
        answer: '如何正确配置用户权限和角色',
        duration: '6:45'
    },
    {
        id: 'faq-4',
        question: '移动端使用指南',
        answer: '在手机和平板上使用平台的技巧',
        duration: '5:20'
    }
]);

const updateVideos = ref([
    {
        id: 1,
        version: 'v2.1.0',
        date: '2024-01-15',
        description: '新增AI智能报价助手，优化用户体验流程',
        videos: [
            {
                id: 'update-2.1-1',
                title: 'AI智能报价功能介绍',
                duration: '6:30'
            },
            {
                id: 'update-2.1-2',
                title: '界面优化说明',
                duration: '4:20'
            }
        ]
    },
    {
        id: 2,
        version: 'v2.0.5',
        date: '2024-01-01',
        description: '修复已知问题，提升系统稳定性',
        videos: [
            {
                id: 'update-2.0.5-1',
                title: '性能优化说明',
                duration: '3:45'
            }
        ]
    },
    {
        id: 3,
        version: 'v2.0.0',
        date: '2023-12-20',
        description: '重大版本更新，全新设计界面和功能架构',
        videos: [
            {
                id: 'update-2.0-1',
                title: '新版本功能概览',
                duration: '12:15'
            },
            {
                id: 'update-2.0-2',
                title: '数据迁移指南',
                duration: '8:30'
            }
        ]
    }
]);

const playVideo = (videoId: string) => {
    currentVideoId.value = videoId;
    showVideoModal.value = true;
};

const closeVideoModal = () => {
    showVideoModal.value = false;
    currentVideoId.value = '';
};

const toggleFullscreen = () => {
    console.log('切换全屏模式');
};
</script>

<style scoped lang="scss">
.video-demo-page {
    padding: 24px;
}

.page-header {
    margin-bottom: 32px;

    h1 {
        margin: 0;
        color: #333;
        font-size: 28px;
    }

    p {
        margin: 8px 0 0 0;
        color: #666;
        font-size: 16px;
    }
}

.featured-video {
    margin-bottom: 32px;

    .video-player-container {
        display: flex;
        gap: 24px;
        align-items: center;

        .video-player {
            flex: 1;
            aspect-ratio: 16/9;
            background: #000;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;

            .video-placeholder {
                text-align: center;
                color: white;

                .layui-icon {
                    margin-bottom: 16px;
                    opacity: 0.8;
                }

                h3 {
                    margin: 0 0 8px 0;
                    font-size: 24px;
                }

                p {
                    margin: 0 0 20px 0;
                    opacity: 0.8;
                }
            }
        }

        .video-info {
            flex: 1;

            h3 {
                margin: 0 0 12px 0;
                color: #333;
                font-size: 20px;
            }

            p {
                margin: 0 0 16px 0;
                color: #666;
                line-height: 1.6;
            }

            .video-meta {
                display: flex;
                gap: 20px;
                font-size: 14px;
                color: #999;

                span {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
            }
        }
    }
}

.video-categories {
    margin-bottom: 32px;
}

.category-card {
    height: 100%;

    .category-description {
        margin-bottom: 16px;
        color: #666;
        font-size: 14px;
    }
}

.video-list {
    .video-item {
        display: flex;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background: #f8f9fa;
            margin: 0 -12px;
            padding: 12px;
            border-radius: 6px;
        }

        &:last-child {
            border-bottom: none;
        }

        .video-thumbnail {
            width: 80px;
            height: 45px;
            background: #000;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;

            .layui-icon {
                color: white;
                font-size: 16px;
            }

            .duration {
                position: absolute;
                bottom: 2px;
                right: 4px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 2px 4px;
                font-size: 10px;
                border-radius: 2px;
            }
        }

        .video-details {
            flex: 1;

            h4 {
                margin: 0 0 4px 0;
                font-size: 14px;
                color: #333;
            }

            p {
                margin: 0 0 8px 0;
                font-size: 12px;
                color: #999;
                line-height: 1.4;
            }

            .video-stats {
                display: flex;
                gap: 12px;
                font-size: 11px;
                color: #999;
            }
        }
    }
}

.faq-videos {
    .faq-video-item {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        height: 100%;

        &:hover {
            background: #e9ecef;
            transform: translateY(-2px);
        }

        .faq-icon {
            text-align: center;
            margin-bottom: 12px;

            .layui-icon {
                font-size: 32px;
                color: #409eff;
            }
        }

        .faq-content {
            text-align: center;

            h4 {
                margin: 0 0 8px 0;
                color: #333;
                font-size: 16px;
            }

            p {
                margin: 0 0 12px 0;
                color: #666;
                font-size: 14px;
                line-height: 1.4;
            }

            .play-button {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
                color: #409eff;
                font-size: 14px;
            }
        }
    }
}

.update-videos {
    .timeline {
        position: relative;

        &::before {
            content: '';
            position: absolute;
            left: 20px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #e0e0e0;
        }

        .timeline-item {
            position: relative;
            padding-left: 60px;
            margin-bottom: 32px;

            .timeline-marker {
                position: absolute;
                left: 8px;
                top: 8px;
                width: 24px;
                height: 24px;
                background: #409eff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;

                .layui-icon {
                    color: white;
                    font-size: 12px;
                }
            }

            .timeline-content {
                .update-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 8px;

                    h4 {
                        margin: 0;
                        color: #333;
                        font-size: 18px;
                    }

                    .update-date {
                        font-size: 14px;
                        color: #999;
                    }
                }

                .update-description {
                    margin-bottom: 16px;
                    color: #666;
                    line-height: 1.5;
                }

                .update-videos-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;

                    .update-video {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 8px 12px;
                        background: #f0f9ff;
                        border-radius: 6px;
                        cursor: pointer;
                        transition: all 0.3s ease;

                        &:hover {
                            background: #e6f7ff;
                        }

                        .layui-icon {
                            color: #409eff;
                        }

                        .video-duration {
                            margin-left: auto;
                            font-size: 12px;
                            color: #999;
                        }
                    }
                }
            }
        }
    }
}

.video-modal-content {
    padding: 20px;

    .video-player-wrapper {
        aspect-ratio: 16/9;
        background: #000;
        border-radius: 8px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        justify-content: center;

        .video-player-placeholder {
            text-align: center;
            color: white;

            .layui-icon {
                margin-bottom: 12px;
                opacity: 0.8;
            }

            p {
                margin: 4px 0;
                opacity: 0.8;
            }

            .video-id {
                font-size: 12px;
                opacity: 0.6;
            }
        }
    }

    .video-controls {
        text-align: right;

        .lay-btn+.lay-btn {
            margin-left: 8px;
        }
    }
}
</style>