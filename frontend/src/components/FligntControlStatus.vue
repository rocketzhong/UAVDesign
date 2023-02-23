<template>
    <div class="wrapper">
        <div class="row">
            <div class="status_wrap">
                <div class="status_title">飞行状态</div>
                <div class="value">未知</div>
            </div>
            <div class="status_wrap">
                <div class="status_title">锁定状态</div>
                <div class="value">锁定</div>
            </div>
            <div class="status_wrap">
                <div class="status_title">GPS状态</div>
                <div class="value">NO</div>
            </div>
        </div>
        <div class="row">
            <div class="status_wrap">
                <div class="status_title">高度</div>
                <div class="value">0.0</div>
            </div>
            <div class="status_wrap">
                <div class="status_title">水平速度</div>
                <div class="value">0.0</div>
            </div>
            <div class="status_wrap">
                <div class="status_title">垂直速度</div>
                <div class="value">0.0</div>
            </div>
        </div>
        <div class="row">
            <div class="status_wrap">
                <div class="status_title">ROL</div>
                <div class="value">0.0</div>
            </div>
            <div class="status_wrap">
                <div class="status_title">PIT</div>
                <div class="value">0.0</div>
            </div>
            <div class="status_wrap">
                <div class="status_title">YAW</div>
                <div class="value">0.0</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.wrapper {
    padding: 0 10px 10px 10px;

    .row {
        .status_wrap {
            display: inline-block;
            width: calc(100% / 3);

            .status_title {
                font-size: 0.7em;
                text-align: center;
            }

            .value {
                font-size: 1.2em;
                font-weight: 600;
                text-align: center;
            }
        }

    }
}
</style>