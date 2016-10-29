find samples -type f -name "*.wav" | while read wav; do
    ffmpeg -i $wav -o $(echo $wav | sed 's/\.wav$/\.mp3$/')
done