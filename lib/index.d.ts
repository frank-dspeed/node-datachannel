import * as stream from 'stream';

export namespace NodeDataChannel {

    // Enum in d.ts is tricky
    export type LogLevel = 'Verbose' | 'Debug' | 'Info' | 'Warning' | 'Error' | 'Fatal';

    // SCTP Settings
    export interface SctpSettings {
        recvBufferSize?: number;
        sendBufferSize?: number;
        maxChunksOnQueue?: number;
        initialCongestionWindow?: number;
        congestionControlModule?: number;
        delayedSackTime?: number;
    }

    // Functions
    export function preload(): void;
    export function initLogger(level: LogLevel): void;
    export function cleanup(): void;
    export function setSctpSettings(settings: SctpSettings): void;

    // Proxy Server
    export type ProxyServerType = 'Socks5' | 'Http';
    export interface ProxyServer {
        type: ProxyServerType;
        ip: string;
        port: number;
        username?: string;
        password?: string;
    }

    export const enum RelayType {
        TurnUdp = 'TurnUdp',
        TurnTcp = 'TurnTcp',
        TurnTls = 'TurnTls',
    }

    export interface IceServer {
        hostname: string;
        port: number;
        username?: string;
        password?: string;
        relayType?: RelayType;
    }

    export type TransportPolicy = 'all' | 'relay';
    export interface RtcConfig {
        iceServers: (string | IceServer)[];
        proxyServer?: ProxyServer;
        enableIceTcp?: boolean;
        portRangeBegin?: number;
        portRangeEnd?: number;
        maxMessageSize?: number;
        mtu?: number;
        iceTransportPolicy?: TransportPolicy;
    }

    export const enum DescriptionType {
        Unspec = 'Unspec',
        Offer = 'Offer',
        Answer = 'Answer',
        Pranswer = 'Pranswer',
        Rollback = 'Rollback',
    }

    export const enum ReliabilityType {
        Reliable = 0,
        Rexmit = 1,
        Timed = 2,
    }

    export interface DataChannelInitConfig {
        protocol?: string;
        negotiated?: boolean;
        id?: number;
        ordered?: boolean;
        maxPacketLifeTime?: number;
        maxRetransmits?: number;

        // Deprecated, use ordered, maxPacketLifeTime, and maxRetransmits
        reliability?: {
            type?: ReliabilityType;
            unordered?: boolean;
            rexmit?: number;
        };
    }

    export interface SelectedCandidateInfo {
        address: string;
        port: number;
        type: string;
        transportType: string;
    }

    // Must be same as rtc enum class Direction
    export const enum Direction {
        SendOnly = 'SendOnly',
        RecvOnly = 'RecvOnly',
        SendRecv = 'SendRecv',
        Inactive = 'Inactive',
        Unknown = 'Unknown',
    }

    export class RtcpReceivingSession {
        requestBitrate(bitRate: number): void;
        requestKeyframe(): boolean;
    }

    export class Audio {
        constructor(mid: string, dir: Direction);
        addAudioCodec(payloadType: number, codec: string, profile?: string): void;
        addOpusCodec(payloadType: number, profile?: string): string;

        direction(): Direction;
        generateSdp(eol: string, addr: string, port: number): string;
        mid(): string;
        setDirection(dir: Direction): void;
        description(): string;
        removeFormat(fmt: string): void;
        addSSRC(ssrc: number, name?: string, msid?: string, trackID?: string): void;
        removeSSRC(ssrc: number): void;
        replaceSSRC(oldSsrc: number, ssrc: number, name?: string, msid?: string, trackID?: string): void;
        hasSSRC(ssrc: number): boolean;
        getSSRCs(): number[];
        getCNameForSsrc(ssrc: number): string;
        setBitrate(bitRate: number): void;
        getBitrate(): number;
        hasPayloadType(payloadType: number): boolean;
        addRTXCodec(payloadType: number, originalPayloadType: number, clockRate: number): void;
        addRTPMap(): void;
        parseSdpLine(line: string): void;
    }

    export class Video {
        constructor(mid: string, dir: Direction);
        addVideoCodec(payloadType: number, codec: string, profile?: string): void;
        addH264Codec(payloadType: number, profile?: string): void;
        addVP8Codec(payloadType: number): void;
        addVP9Codec(payloadType: number): void;

        direction(): Direction;
        generateSdp(eol: string, addr: string, port: number): string;
        mid(): string;
        setDirection(dir: Direction): void;
        description(): string;
        removeFormat(fmt: string): void;
        addSSRC(ssrc: number, name?: string, msid?: string, trackID?: string): void;
        removeSSRC(ssrc: number): void;
        replaceSSRC(oldSsrc: number, ssrc: number, name?: string, msid?: string, trackID?: string): void;
        hasSSRC(ssrc: number): boolean;
        getSSRCs(): number[];
        getCNameForSsrc(ssrc: number): string;
        setBitrate(bitRate: number): void;
        getBitrate(): number;
        hasPayloadType(payloadType: number): boolean;
        addRTXCodec(payloadType: number, originalPayloadType: number, clockRate: number): void;
        addRTPMap(): void;
        parseSdpLine(line: string): void;
    }

    export class Track {
        direction(): Direction;
        mid(): string;
        type(): string;
        close(): void;
        sendMessage(msg: string): boolean;
        sendMessageBinary(buffer: Buffer): boolean;
        isOpen(): boolean;
        isClosed(): boolean;
        bufferedAmount(): number;
        maxMessageSize(): number;
        setBufferedAmountLowThreshold(newSize: number): void;
        requestKeyframe(): boolean;
        setMediaHandler(handler: RtcpReceivingSession): void;
        onOpen(cb: () => void): void;
        onClosed(cb: () => void): void;
        onError(cb: (err: string) => void): void;
        onMessage(cb: (msg: Buffer) => void): void;
    }

    export class DataChannel {
        close(): void;
        getLabel(): string;
        getId(): number;
        getProtocol(): string;
        sendMessage(msg: string): boolean;
        sendMessageBinary(buffer: Buffer): boolean;
        isOpen(): boolean;
        bufferedAmount(): number;
        maxMessageSize(): number;
        setBufferedAmountLowThreshold(newSize: number): void;
        onOpen(cb: () => void): void;
        onClosed(cb: () => void): void;
        onError(cb: (err: string) => void): void;
        onBufferedAmountLow(cb: () => void): void;
        onMessage(cb: (msg: string | Buffer) => void): void;
    }

    export class PeerConnection {
        constructor(peerName: string, config: RtcConfig);
        close(): void;
        setLocalDescription(type?: DescriptionType): void;
        setRemoteDescription(sdp: string, type: DescriptionType): void;
        localDescription(): { type: string; sdp: string } | null;
        addRemoteCandidate(candidate: string, mid: string): void;
        createDataChannel(label: string, config?: DataChannelInitConfig): DataChannel;
        addTrack(media: Video | Audio): Track;
        hasMedia(): boolean;
        state(): string;
        signalingState(): string;
        gatheringState(): string;
        onLocalDescription(cb: (sdp: string, type: DescriptionType) => void): void;
        onLocalCandidate(cb: (candidate: string, mid: string) => void): void;
        onStateChange(cb: (state: string) => void): void;
        onSignalingStateChange(cb: (state: string) => void): void;
        onGatheringStateChange(cb: (state: string) => void): void;
        onDataChannel(cb: (dc: DataChannel) => void): void;
        onTrack(cb: (track: Track) => void): void;
        bytesSent(): number;
        bytesReceived(): number;
        rtt(): number;
        getSelectedCandidatePair(): { local: SelectedCandidateInfo; remote: SelectedCandidateInfo } | null;
    }
}

export class DataChannelStream extends stream.Duplex {
    constructor(rawChannel: DataChannel, options?: Omit<stream.DuplexOptions, 'objectMode'>);
    get label(): string;
}
