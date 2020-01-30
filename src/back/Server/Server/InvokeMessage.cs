using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;
using System.Text.Json;

namespace Server
{
    public class InvokeMessageBody
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("body")]
        public object Body { get; set; }
    }
    public class InvokeMessage
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("invocationId")]
        public string InvocationId { get; set; }
        [JsonPropertyName("type")]
        public string Type { get; set; }
        [JsonPropertyName("payload")]
        public InvokeMessageBody Payload { get; set; }
    }

    public static class Extensions
    {
        public static bool IsJson(this string text)
        {
            text = text.Trim();
            if ((text.StartsWith("{") && text.EndsWith("}")) || //For object
                (text.StartsWith("[") && text.EndsWith("]"))) //For array
            {
                try
                {
                    var obj = JsonSerializer.Deserialize(text, typeof(object)); // JToken.Parse(text);
                    return true;
                }
                catch (Exception ex) //some other exception
                {
                    Console.WriteLine($"Parse json error: {ex.Message}");
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

        public static InvokeMessage ToMessage(this string json)
        {
            InvokeMessage message = null;

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };

            if (json.IsJson())
            {
                message = JsonSerializer.Deserialize<InvokeMessage>(json, options);
            }

            return message;
        }

        public static string ToJson(this InvokeMessage message)
        {

            return JsonSerializer.Serialize(message);
        }
    }
}
